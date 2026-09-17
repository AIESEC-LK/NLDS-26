/**
 * Zod validation schemas for each registration step.
 * These schemas are used by react-hook-form via @hookform/resolvers.
 */

import { z } from "zod";
import { ENTITY_IG_MAPPING, OTHER_ENTITY_IGS } from "./constants";

/* ─── Mission 1 — Personal Intel ─────────────────────────── */

export const personalIntelSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    ),
  preferredName: z
    .string()
    .min(2, "Preferred name must be at least 2 characters")
    .max(50, "Preferred name must be at most 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    ),
  personalEmail: z
    .string()
    .min(1, "Personal Email is required")
    .email("Please enter a valid email address")
    .refine((val) => !val.toLowerCase().endsWith("@aiesec.net"), {
      message:
        "Please provide your personal email address, not your AIESEC email.",
    }),
  phone: z
    .string()
    .regex(
      /^(?:0[0-9]{9}|\+94[0-9]{9})$/,
      "Phone must be exactly 10 digits (e.g., 0771234567) or +94 format",
    ),
  profilePicture: z
    .string()
    .min(1, "Profile picture is required")
    .max(1000, "File reference is too long"),
  gender: z.string().min(1, "Please select your gender"),
  dateOfBirth: z.string().min(1, "Please enter your date of birth"),
  nationalIdOrPassport: z
    .string()
    .regex(
      /^(?:[0-9]{9}[vVxX]|[0-9]{12}|[a-zA-Z0-9]{7,12})$/,
      "Please enter a valid SL NIC (e.g., 981234567V or 199812345678) or Passport",
    ),
});

/* ─── Mission 2 — AIESEC Intel ───────────────────────────── */

export const aiesecIntelSchema = z
  .object({
    participantType: z
      .string()
      .min(1, "Please select if you are a Newbie or Oldbie"),
    aiesecEmail: z.string().optional().or(z.literal("")),
    entity: z.string().min(1, "Please select your AIESEC entity"),
    initiativeGroup: z.string().optional(),
    customInitiativeGroup: z.string().optional(),
    currentPosition: z
      .string()
      .min(1, "Please select your current AIESEC position"),
  })
  .superRefine((data, ctx) => {
    const { entity, initiativeGroup, aiesecEmail } = data;
    let allowedIgs: readonly string[] = [];

    // Validate format only if an email is provided (optional for both Newbies and Oldbies)
    if (aiesecEmail && aiesecEmail.trim() !== "") {
      if (
        !aiesecEmail.includes("@") ||
        !aiesecEmail.toLowerCase().endsWith("@aiesec.net")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Please enter a valid AIESEC email address ending with @aiesec.net.",
          path: ["aiesecEmail"],
        });
      }
    }

    if (entity) {
      if (entity === "Other") {
        allowedIgs = OTHER_ENTITY_IGS;
      } else {
        allowedIgs = ENTITY_IG_MAPPING[entity] || [];
      }

      if (initiativeGroup && initiativeGroup.trim() !== "") {
        if (!allowedIgs.includes(initiativeGroup)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid Initiative Group (IG) for the selected entity",
            path: ["initiativeGroup"],
          });
        }
      }
    }
  });

/* ─── Mission 3 — Agent Profile ──────────────────────────── */

export const agentProfileSchema = z
  .object({
    foodPreference: z.string().min(1, "Please select your food preference"),
    medicalConditions: z
      .string()
      .max(500, "Medical conditions must be at most 500 characters")
      .optional()
      .or(z.literal("")),
    guardianName: z
      .string()
      .min(2, "Guardian name is required")
      .max(100, "Name must be at most 100 characters"),
    guardianContact: z
      .string()
      .regex(
        /^(?:0[0-9]{9}|\+94[0-9]{9})$/,
        "Phone must be exactly 10 digits (e.g., 0771234567) or +94 format",
      ),
    cvLink: z
      .string()
      .max(1000, "File reference is too long")
      .optional()
      .or(z.literal("")),
    cvConsent: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.cvLink && data.cvLink.trim() !== "") {
      if (!data.cvConsent || data.cvConsent.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please indicate whether you consent to sharing your CV.",
          path: ["cvConsent"],
        });
      }
    }
  });

/* ─── Mission 4 — Mission Intel ──────────────────────────── */

export const missionIntelSchema = z.object({
  missionGoal: z
    .string()
    .min(10, "Please provide a meaningful response (at least 10 characters)")
    .max(1000, "Response is too long, please keep it under 1000 characters"),
  additionalInformation: z
    .string()
    .max(1000, "Response is too long")
    .optional()
    .or(z.literal("")),
});

/* ─── Mission 5 — Mission Readiness ──────────────────────── */

export const missionReadinessSchema = z.object({
  readinessLevel: z
    .string()
    .min(1, "Please declare your readiness state before proceeding"),
});

/* ─── Per-step schema map ────────────────────────────────── */

export const stepSchemas = [
  personalIntelSchema,
  aiesecIntelSchema,
  agentProfileSchema,
  missionIntelSchema,
  missionReadinessSchema,
] as const;
