import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/backend/db/prisma";
import { RegistrationService } from "@/lib/backend/services/registration.service";
import { RegistrationRepository } from "@/lib/backend/repositories/registration.repository";
import { ServerRegistrationSchema } from "@/lib/backend/validation/registration.schema";
import { syncService } from "@/lib/backend/events/sync.service";
import { verifyTurnstileToken } from "@/lib/captcha";

export const maxDuration = 60;

const repo = new RegistrationRepository();
const service = new RegistrationService(repo);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const turnstileToken = body.turnstileToken;
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Security check failed. Captcha token missing." },
        { status: 400 },
      );
    }

    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "Security check failed. Please refresh and try again." },
        { status: 403 },
      );
    }

    const participantId = body.nationalIdOrPassport; // we'll use this temporarily to check if existing
    if (!participantId) {
      return NextResponse.json(
        { error: "National ID or Passport is required." },
        { status: 400 },
      );
    }

    // Structural intercept: Duplicate submission lockout mapping native DB relations securely
    const existingParticipant = await prisma.participant.findUnique({
      where: { nationalIdOrPassport: participantId },
      include: { registrations: { where: { status: { not: "CANCELLED" } } } },
    });

    if (existingParticipant && existingParticipant.registrations.length > 0) {
      return NextResponse.json(
        { error: "Mission file has already been submitted for this identity." },
        { status: 409 },
      );
    }

    // 1. Server-Side DTO Validation
    const result = ServerRegistrationSchema.safeParse(body);
    if (!result.success) {
      console.error(JSON.stringify((result.error as any).errors, null, 2));
      return NextResponse.json(
        { error: "Validation Failed", details: (result as any).error.errors },
        { status: 400 },
      );
    }

    const data = result.data;

    // 2. Map structural DTO to Controller primitives mapping Prisma
    const participantData = {
      fullName: data.fullName,
      preferredName: data.preferredName,
      personalEmail: data.personalEmail,
      phone: data.phone,
      profilePicture: data.profilePicture,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      nationalIdOrPassport: data.nationalIdOrPassport,
      aiesecEmail: data.aiesecEmail,
    };

    // Structural Entity Resolver
    // Since frontend populates string names instead of seeded DB UUIDs yet, map natively:
    let resolvedEntity = await prisma.entity.findUnique({
      where: { name: data.entityId },
    });
    if (!resolvedEntity) {
      resolvedEntity = await prisma.entity.create({
        data: { name: data.entityId },
      });
    }

    let resolvedIg = null;
    if (data.initiativeGroupId) {
      resolvedIg = await prisma.initiativeGroup.findFirst({
        where: { name: data.initiativeGroupId, entityId: resolvedEntity.id },
      });
      if (!resolvedIg) {
        resolvedIg = await prisma.initiativeGroup.create({
          data: { name: data.initiativeGroupId, entityId: resolvedEntity.id },
        });
      }
    }

    const registrationData = {
      entity: { connect: { id: resolvedEntity.id } },
      ...(resolvedIg
        ? { initiativeGroup: { connect: { id: resolvedIg.id } } }
        : {}),
      participantType: data.participantType,
      customInitiativeGroup: data.customInitiativeGroup,
      currentPosition: data.currentPosition,
      foodPreference: data.foodPreference,
      medicalConditions: data.medicalConditions,
      guardianName: data.guardianName,
      guardianContact: data.guardianContact,
      missionGoal: data.missionGoal,
      additionalInformation: data.additionalInformation,
      readinessLevel: data.readinessLevel,
    };

    const documents = data.documents.map((d) => ({
      type: d.type,
      urlReference: d.urlReference,
      consentGiven: d.consentGiven ?? null,
    }));

    // 3. Delegate to business layer
    const registration = await service.submitRegistration(
      participantData,
      registrationData,
      documents,
    );

    // Ping to the Admin Portal for instant Google Sheets sync
    if (process.env.ADMIN_PORTAL_URL && process.env.CRON_SECRET) {
      // VERCEL FIX: We MUST await this fetch request. If we don't, Vercel instantly kills the serverless function before the fetch finishes.
      await fetch(`${process.env.ADMIN_PORTAL_URL}/api/webhook/sync-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CRON_SECRET}`
        },
        body: JSON.stringify({ registrationId: registration.id })
      }).catch((error) => {
        console.error("Failed to ping Admin webhook for live sync:", error);
      });
    }

    // 4. Trigger Webhooks and Integrations.
    // VERCEL PATCH: Must be explicitly awaited, or Vercel deletes the memory context instantly.
    const entityName = resolvedEntity;
    const igName = resolvedIg;

    await syncService.dispatch({
      registrationId: registration.id,
      referenceCode: registration.referenceCode,
      type: "REGISTRATION_SUBMITTED",
      payload: {
        referenceCode: registration.referenceCode,
        participantId: registration.participantId,
        fullName: data.fullName,
        preferredName: data.preferredName,
        personalEmail: data.personalEmail,
        phone: data.phone,
        profilePicture: data.profilePicture,
        dateOfBirth: data.dateOfBirth,
        nationalIdOrPassport: data.nationalIdOrPassport,
        aiesecEmail: data.aiesecEmail || "N/A",
        participantType: data.participantType,
        entityName: entityName?.name || "Unknown",
        igName: igName?.name || "N/A",
        customInitiativeGroup: data.customInitiativeGroup || "N/A",
        currentPosition: data.currentPosition,
        gender: data.gender,
        foodPreference: data.foodPreference,
        medicalConditions: data.medicalConditions || "None",
        guardianName: data.guardianName,
        guardianContact: data.guardianContact,
        missionGoal: data.missionGoal,
        additionalInformation: data.additionalInformation || "None",
        readinessLevel: data.readinessLevel,
        hasCv: documents.length > 0,
        cvReference:
          documents.find((d) => d.type === "CV")?.urlReference || "[NO CV]",
        cvConsent: documents.find((d) => d.type === "CV")?.consentGiven
          ? "YES"
          : "NO",
      },
    });

    return NextResponse.json(
      {
        success: true,
        referenceCode: registration.referenceCode,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[Submit Registration]", error);

    // Hide internal DB throws securely
    const isTechnicalError =
      error?.message &&
      (error.message.toLowerCase().includes("prisma") ||
        error.message.toLowerCase().includes("database") ||
        error.message.toLowerCase().includes("turbopack") ||
        error.message.toLowerCase().includes("db") ||
        error.message.toLowerCase().includes("aws") ||
        error.message.toLowerCase().includes("transaction") ||
        error.message.toLowerCase().includes("invocation") ||
        error.message.toLowerCase().includes("timeout") ||
        error.message.toLowerCase().includes("connection"));

    const safeMessage = isTechnicalError
      ? "An internal server error occurred. Please try again later."
      : error.message || "An unexpected error occurred during submission.";

    return NextResponse.json(
      {
        error: safeMessage,
      },
      { status: 500 },
    );
  }
}
