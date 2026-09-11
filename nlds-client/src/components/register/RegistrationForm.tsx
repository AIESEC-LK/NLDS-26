"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";

import StepIndicator from "@/components/register/StepIndicator";
import StepHeader from "@/components/register/StepHeader";
import StepNavigation from "@/components/register/StepNavigation";
import PersonalIntel from "@/components/register/steps/PersonalIntel";
import AiesecIntel from "@/components/register/steps/AiesecIntel";
import AgentProfile from "@/components/register/steps/AgentProfile";
import MissionIntel from "@/components/register/steps/MissionIntel";
import MissionReadiness from "@/components/register/steps/MissionReadiness";
import FinalReview from "@/components/register/steps/FinalReview";
import SubmissionSuccess from "@/components/register/SubmissionSuccess";

import { TOTAL_STEPS, type RegistrationFormData } from "@/lib/register/types";
import {
  personalIntelSchema,
  aiesecIntelSchema,
  agentProfileSchema,
  missionIntelSchema,
  missionReadinessSchema,
} from "@/lib/register/schema";

const registrationSchema = z.object({
  personalIntel: personalIntelSchema,
  aiesecIntel: aiesecIntelSchema,
  agentProfile: agentProfileSchema,
  missionIntel: missionIntelSchema,
  missionReadiness: missionReadinessSchema,
});

const defaultValues: RegistrationFormData = {
  personalIntel: {
    fullName: "",
    preferredName: "",
    personalEmail: "",
    phone: "",
    profilePicture: "",
    gender: "",
    dateOfBirth: "",
    nationalIdOrPassport: "",
  },
  aiesecIntel: {
    participantType: "OLDBIE",
    aiesecEmail: "",
    entity: "",
    initiativeGroup: "",
    customInitiativeGroup: "",
    currentPosition: "",
  },
  agentProfile: {
    foodPreference: "",
    medicalConditions: "",
    guardianName: "",
    guardianContact: "",
    cvLink: "",
    cvConsent: "",
  },
  missionIntel: {
    missionGoal: "",
    additionalInformation: "",
  },
  missionReadiness: {
    readinessLevel: "",
  },
};

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 28 : -28,
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.985,
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -28 : 28,
    opacity: 0,
    filter: "blur(6px)",
    scale: 0.99,
  }),
};

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitReferenceCode, setSubmitReferenceCode] = useState<string | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const formTopRef = useRef<HTMLElement>(null);

  const methods = useForm<RegistrationFormData>({
    defaultValues,
    resolver: zodResolver(registrationSchema) as never,
    mode: "onBlur",
  });

  const { handleSubmit, trigger, watch, reset } = methods;

  // Smart Caching: Saves inputs when the OS suspends the tab (e.g. going to WhatsApp),
  // but explicitly wipes them if the user performs a manual refresh.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const navEntries = performance.getEntriesByType("navigation");
    const isReload =
      navEntries.length > 0 &&
      (navEntries[0] as PerformanceNavigationTiming).type === "reload";

    if (isReload) {
      // User manually refreshed -> wipe cache
      sessionStorage.removeItem("nlds_reg_backup");
    } else {
      // Tab restored by OS -> recover data
      const backup = sessionStorage.getItem("nlds_reg_backup");
      if (backup) {
        try {
          const parsed = JSON.parse(backup);
          reset(parsed.data);
          if (parsed.step) setCurrentStep(parsed.step);
        } catch (e) {}
      }
    }
  }, [reset]);

  // Continuously backup form data
  const formSnapshot = watch();
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "nlds_reg_backup",
        JSON.stringify({ data: formSnapshot, step: currentStep }),
      );
    }
  }, [formSnapshot, currentStep]);

  const markComplete = useCallback((step: number) => {
    setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
  }, []);

  const goToStep = useCallback(
    async (targetStep: number) => {
      if (targetStep > currentStep && currentStep === 0) {
        type PersonalField =
          `personalIntel.${keyof RegistrationFormData["personalIntel"]}`;
        const fieldsToValidate: PersonalField[] = [
          "personalIntel.fullName",
          "personalIntel.preferredName",
          "personalIntel.personalEmail",
          "personalIntel.phone",
          "personalIntel.profilePicture",
          "personalIntel.gender",
          "personalIntel.dateOfBirth",
          "personalIntel.nationalIdOrPassport",
        ];
        const valid = await trigger(fieldsToValidate);
        if (!valid) return;
        markComplete(currentStep);
      }

      if (targetStep > currentStep && currentStep === 1) {
        type AiesecField =
          `aiesecIntel.${keyof RegistrationFormData["aiesecIntel"]}`;
        const fieldsToValidate: AiesecField[] = [
          "aiesecIntel.participantType",
          "aiesecIntel.aiesecEmail",
          "aiesecIntel.entity",
          "aiesecIntel.initiativeGroup",
          "aiesecIntel.customInitiativeGroup",
          "aiesecIntel.currentPosition",
        ];
        const valid = await trigger(fieldsToValidate);
        if (!valid) return;
        markComplete(currentStep);
      }

      if (targetStep > currentStep && currentStep === 2) {
        type AgentField =
          `agentProfile.${keyof RegistrationFormData["agentProfile"]}`;
        const fieldsToValidate: AgentField[] = [
          "agentProfile.foodPreference",
          "agentProfile.medicalConditions",
          "agentProfile.guardianName",
          "agentProfile.guardianContact",
          "agentProfile.cvLink",
          "agentProfile.cvConsent",
        ];
        const valid = await trigger(fieldsToValidate);
        if (!valid) return;
        markComplete(currentStep);
      }

      if (targetStep > currentStep && currentStep === 3) {
        type MissionIntelField =
          `missionIntel.${keyof RegistrationFormData["missionIntel"]}`;
        const fieldsToValidate: MissionIntelField[] = [
          "missionIntel.missionGoal",
          "missionIntel.additionalInformation",
        ];
        const valid = await trigger(fieldsToValidate);
        if (!valid) return;
        markComplete(currentStep);
      }

      if (targetStep > currentStep && currentStep === 4) {
        type MissionReadinessField =
          `missionReadiness.${keyof RegistrationFormData["missionReadiness"]}`;
        const fieldsToValidate: MissionReadinessField[] = [
          "missionReadiness.readinessLevel",
        ];
        const valid = await trigger(fieldsToValidate);
        if (!valid) return;
        markComplete(currentStep);
      }

      setDirection(targetStep > currentStep ? 1 : -1);
      setCurrentStep(targetStep);
      // Blur any focused input first — prevents the browser auto-scrolling
      // to the newly focused field in the next step (the main cause on mobile)
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      // Immediate scroll to top (instant = can't be overridden by pending focus)
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      // Safety net: scroll again after animation settles
      setTimeout(
        () =>
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }),
        350,
      );
    },
    [currentStep, trigger, markComplete],
  );

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      goToStep(currentStep + 1);
    }
  }, [currentStep, goToStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      setTimeout(
        () =>
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }),
        350,
      );
    }
  }, [currentStep]);

  const onSubmit = async (data: RegistrationFormData) => {
    if (isSubmitting) return;
    
    if (!turnstileToken) {
      setSubmitError("Please complete the Security Check (Captcha) before submitting.");
      setIsSuccess(true);
      // Scroll to top so error screen appears at the top on mobile
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitReferenceCode(null);

    try {
      const payload = {
        fullName: data.personalIntel.fullName,
        preferredName: data.personalIntel.preferredName,
        personalEmail: data.personalIntel.personalEmail,
        phone: data.personalIntel.phone,
        profilePicture: data.personalIntel.profilePicture,
        gender: data.personalIntel.gender,
        dateOfBirth: data.personalIntel.dateOfBirth,
        nationalIdOrPassport: data.personalIntel.nationalIdOrPassport,
        participantType: data.aiesecIntel.participantType,
        aiesecEmail:
          data.aiesecIntel.participantType === "NEWBIE" &&
          !data.aiesecIntel.aiesecEmail
            ? undefined
            : data.aiesecIntel.aiesecEmail,
        entityId: data.aiesecIntel.entity,
        initiativeGroupId:
          data.aiesecIntel.initiativeGroup === "none"
            ? undefined
            : data.aiesecIntel.initiativeGroup,
        customInitiativeGroup: data.aiesecIntel.customInitiativeGroup,
        currentPosition: data.aiesecIntel.currentPosition,
        foodPreference: data.agentProfile.foodPreference,
        medicalConditions: data.agentProfile.medicalConditions,
        guardianName: data.agentProfile.guardianName,
        guardianContact: data.agentProfile.guardianContact,
        missionGoal: data.missionIntel.missionGoal,
        additionalInformation: data.missionIntel.additionalInformation,
        readinessLevel: data.missionReadiness.readinessLevel,
        documents: data.agentProfile.cvLink
          ? [
              {
                type: "CV",
                urlReference: data.agentProfile.cvLink,
                consentGiven: data.agentProfile.cvConsent === "yes",
              },
            ]
          : [],
        turnstileToken,
      };

      const res = await fetch("/api/register/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to transmit file.");
      }

      // Enforce realistic minimum cinematic processing time for the "Transmitting..." screen
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Wipe session backup on successful submit
      sessionStorage.removeItem("nlds_reg_backup");

      setSubmitReferenceCode(responseData.referenceCode);
      setIsSuccess(true);
      // Scroll to top so success screen appears at the top on mobile
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      setTimeout(
        () =>
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }),
        350,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to transmit file.";
      console.error("[Submission Error]", error);
      setSubmitError(message);
      setIsSuccess(true);
      // Scroll to top so error screen appears at the top on mobile
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      setTimeout(
        () =>
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }),
        350,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  function renderStep() {
    switch (currentStep) {
      case 0:
        return <PersonalIntel />;
      case 1:
        return <AiesecIntel />;
      case 2:
        return <AgentProfile />;
      case 3:
        return <MissionIntel />;
      case 4:
        return <MissionReadiness />;
      case 5:
        return (
          <FinalReview
            onEditStep={(target) => {
              setDirection(target > currentStep ? 1 : -1);
              setCurrentStep(target);
            }}
          />
        );
      default:
        return null;
    }
  }

  const showOutcome =
    isSuccess || (isSubmitting && currentStep === TOTAL_STEPS - 1);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <section
          ref={formTopRef}
          className="reg-shell w-full"
          style={{
            minHeight: "70vh",
            paddingTop: "8.5rem",
            paddingBottom: "6rem",
          }}
        >
          <div className="reg-shell__radar" />

          {showOutcome ? (
            <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
              <SubmissionSuccess
                referenceCode={submitReferenceCode}
                error={submitError}
                onRetry={() => {
                  setIsSuccess(false);
                  setSubmitError(null);
                  setSubmitReferenceCode(null);
                }}
              />
            </div>
          ) : (
            <div
              className="relative z-10 mx-auto w-full"
              style={{
                maxWidth: "1200px",
                paddingLeft: "clamp(1.5rem, 4vw, 2.5rem)",
                paddingRight: "clamp(1.5rem, 4vw, 2.5rem)",
              }}
            >
              <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 pt-4">
                <div>
                  <p className="font-classified text-[11px] tracking-[0.2em] text-[var(--text-dim)] mb-2">
                    NLDS 2026
                  </p>
                  <h1
                    className="font-display leading-[0.85] tracking-[0.04em]"
                    style={{
                      fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
                      color: "var(--text)",
                    }}
                  >
                    REGISTRATION
                  </h1>
                </div>
                <p className="font-classified text-[9px] tracking-[0.28em] uppercase text-[var(--red)] sm:text-right">
                  CLASSIFIED // REGISTRATION PROTOCOL
                </p>
              </header>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <div className="lg:w-[280px] xl:w-[300px] flex-shrink-0">
                  <div className="lg:sticky lg:top-[100px]">
                    <StepIndicator
                      currentStep={currentStep}
                      completedSteps={completedSteps}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <StepHeader currentStep={currentStep} />

                  <div
                    className="reg-panel"
                    style={{ padding: "clamp(1.5rem, 4vw, 3rem)" }}
                  >
                    <div className="absolute top-3 left-3 w-3 h-3 corner-tl border-white/08" />
                    <div className="absolute top-3 right-3 w-3 h-3 corner-tr border-white/08" />
                    <div className="absolute bottom-3 left-3 w-3 h-3 corner-bl border-white/08" />
                    <div className="absolute bottom-3 right-3 w-3 h-3 corner-br border-white/08" />

                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {renderStep()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <StepNavigation
                    currentStep={currentStep}
                    isSubmitting={isSubmitting}
                    onPrev={handlePrev}
                    onNext={handleNext}
                  />

                  {currentStep === 5 && (
                    <div className="mt-8 flex justify-center">
                      <Turnstile
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                        onSuccess={(token) => setTurnstileToken(token)}
                        options={{ theme: "dark" }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-3 mt-8">
                    <div
                      className="h-[1px] w-6"
                      style={{ background: "var(--border)" }}
                    />
                    <span className="font-classified text-[10px] tracking-[0.15em] text-white/40 uppercase">
                      REGISTRATION DATA IS ENCRYPTED IN TRANSIT
                    </span>
                    <div
                      className="h-[1px] w-6"
                      style={{ background: "var(--border)" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </form>
    </FormProvider>
  );
}
