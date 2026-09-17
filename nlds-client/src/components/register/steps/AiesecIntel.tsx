"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormSelect, FormInput } from "@/components/register/FormField";
import SectionLabel from "@/components/register/SectionLabel";
import {
  AIESEC_ENTITIES,
  ENTITY_IG_MAPPING,
  OTHER_ENTITY_IGS,
  AIESEC_POSITIONS,
} from "@/lib/register/constants";
import type { AiesecIntelData } from "@/lib/register/types";

export default function AiesecIntel() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<{ aiesecIntel: AiesecIntelData }>();

  const e = errors.aiesecIntel;

  const participantType = useWatch({
    control,
    name: "aiesecIntel.participantType",
  });
  const entity = useWatch({ control, name: "aiesecIntel.entity" });
  const initiativeGroup = useWatch({
    control,
    name: "aiesecIntel.initiativeGroup",
  });

  const igOptions = useMemo(() => {
    if (!entity) return [];
    if (entity === "Other") return OTHER_ENTITY_IGS;
    return ENTITY_IG_MAPPING[entity] || [];
  }, [entity]);

  useEffect(() => {
    if (entity) {
      if (initiativeGroup && !igOptions.includes(initiativeGroup as never)) {
        setValue("aiesecIntel.initiativeGroup", "", { shouldValidate: true });
        setValue("aiesecIntel.customInitiativeGroup", "", {
          shouldValidate: true,
        });
      }
    }
  }, [entity, igOptions, initiativeGroup, setValue]);

  useEffect(() => {
    if (initiativeGroup !== "Other IG") {
      setValue("aiesecIntel.customInitiativeGroup", "", {
        shouldValidate: true,
      });
    }
  }, [initiativeGroup, setValue]);

  const [newbieEmailChoice, setNewbieEmailChoice] = useState<"NA" | "YES">(
    "NA",
  );

  // Important: if they switch from Newbie YES back to N/A, clear the aiesec email value so it doesn't fail validation.
  useEffect(() => {
    if (participantType === "NEWBIE" && newbieEmailChoice === "NA") {
      setValue("aiesecIntel.aiesecEmail", "", { shouldValidate: true });
    }
  }, [newbieEmailChoice, participantType, setValue]);

  const selectType = (type: "NEWBIE" | "OLDBIE") => {
    setValue("aiesecIntel.participantType", type, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-5">
        <SectionLabel>AIESEC AFFILIATION & IDENTITY VERIFICATION</SectionLabel>

        <div className="flex flex-col gap-3 mb-2">
          <label className="font-sans text-[13px] tracking-wide font-medium uppercase text-[var(--text-dim)]">
            Are you a Newbie or Oldbie?{" "}
            <span className="text-[var(--red)]">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              className={`reg-choice ${participantType === "NEWBIE" ? "reg-choice--active" : ""}`}
              aria-pressed={participantType === "NEWBIE"}
              onClick={() => selectType("NEWBIE")}
            >
              {participantType === "NEWBIE" && (
                <span
                  className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center z-10"
                  style={{ background: "var(--red)" }}
                  aria-hidden
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
              <span className="font-display text-[2rem] leading-none tracking-[0.12em]">
                NEWBIE
              </span>
              <span className="font-sans text-[13px] tracking-wide text-[var(--text-muted)] mt-1">
                New to AIESEC
              </span>
            </button>
            <button
              type="button"
              className={`reg-choice ${participantType === "OLDBIE" ? "reg-choice--active" : ""}`}
              aria-pressed={participantType === "OLDBIE"}
              onClick={() => selectType("OLDBIE")}
            >
              {participantType === "OLDBIE" && (
                <span
                  className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center z-10"
                  style={{ background: "var(--red)" }}
                  aria-hidden
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
              <span className="font-display text-[2rem] leading-none tracking-[0.12em]">
                OLDBIE
              </span>
              <span className="font-sans text-[13px] tracking-wide text-[var(--text-muted)] mt-1">
                Existing AIESEC member
              </span>
            </button>
          </div>
          <input type="hidden" {...register("aiesecIntel.participantType")} />
          {e?.participantType && (
            <p className="text-[11px] text-red-500 font-medium m-0">
              {e.participantType.message}
            </p>
          )}
        </div>

        {participantType === "NEWBIE" ? (
          <div className="flex flex-col gap-5">
            <FormSelect
              label="Do you have an AIESEC Email?"
              options={[
                "N/A (I don't have one)",
                "Yes, I have an AIESEC Email",
              ]}
              placeholder="Select..."
              value={
                newbieEmailChoice === "NA"
                  ? "N/A (I don't have one)"
                  : "Yes, I have an AIESEC Email"
              }
              onChange={(e) =>
                setNewbieEmailChoice(
                  e.target.value.startsWith("Yes") ? "YES" : "NA",
                )
              }
              required
            />
            {newbieEmailChoice === "YES" && (
              <FormInput
                label="Agent, provide your secure channel of communication with the mission team. (AIESEC email)"
                type="email"
                placeholder="Enter your AIESEC email (name@aiesec.net)"
                error={e?.aiesecEmail}
                {...register("aiesecIntel.aiesecEmail")}
              />
            )}
          </div>
        ) : (
          <FormInput
            label="Agent, provide your secure channel of communication with the mission team. (AIESEC email)"
            type="email"
            placeholder="Enter your AIESEC email (name@aiesec.net)"
            error={e?.aiesecEmail}
            {...register("aiesecIntel.aiesecEmail")}
          />
        )}

        <FormSelect
          label="Identify your AIESEC entity, the team you represent on this mission."
          options={AIESEC_ENTITIES}
          placeholder="Identify your AIESEC entity"
          required
          error={e?.entity}
          {...register("aiesecIntel.entity")}
        />

        {entity && igOptions.length > 0 && (
          <FormSelect
            label="Initiative Group (IG)"
            options={igOptions}
            placeholder="Select your Initiative Group (IG)"
            error={e?.initiativeGroup}
            {...register("aiesecIntel.initiativeGroup")}
          />
        )}

        {entity && igOptions.length === 0 && entity !== "Other" && (
          <p
            className="font-sans text-[13px] tracking-wide text-[var(--text-dim)] uppercase p-4 mt-2"
            style={{ border: "1px dashed var(--border-strong)" }}
          >
            No mapped Initiative Groups for {entity}. Please proceed.
          </p>
        )}

        {entity === "Other" && initiativeGroup === "Other IG" && (
          <FormInput
            label="Custom Initiative Group Name"
            placeholder="Enter your Initiative Group name"
            error={e?.customInitiativeGroup}
            {...register("aiesecIntel.customInitiativeGroup")}
          />
        )}

        <FormSelect
          label="Declare your current position within AIESEC."
          options={AIESEC_POSITIONS}
          placeholder="Declare your current position"
          required
          error={e?.currentPosition}
          {...register("aiesecIntel.currentPosition")}
        />
      </fieldset>
    </div>
  );
}
