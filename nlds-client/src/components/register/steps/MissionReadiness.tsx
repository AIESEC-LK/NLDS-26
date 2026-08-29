import { useFormContext, useWatch } from "react-hook-form";
import { READINESS_OPTIONS } from "@/lib/register/constants";
import SectionLabel from "@/components/register/SectionLabel";
import type { MissionReadinessData } from "@/lib/register/types";
import { motion } from "framer-motion";

export default function MissionReadiness() {
    const {
        setValue,
        formState: { errors },
    } = useFormContext<{ missionReadiness: MissionReadinessData }>();

    const e = errors.missionReadiness;
    const currentReadiness = useWatch({ name: "missionReadiness.readinessLevel" });

    return (
        <div className="flex flex-col gap-8">
            <fieldset className="flex flex-col gap-5">
                <SectionLabel>MISSION READINESS PROTOCOL</SectionLabel>

                <p className="font-sans text-[14px] tracking-wide text-[var(--text-dim)] uppercase mb-2 font-medium">
                    On a scale of 1-5, how ready are you to accept the mission?
                </p>

                <div className="flex flex-col gap-4">
                    {READINESS_OPTIONS.map((option) => {
                        const isSelected = currentReadiness === option.level;
                        return (
                            <motion.button
                                type="button"
                                key={option.level}
                                onClick={() =>
                                    setValue("missionReadiness.readinessLevel", option.level, {
                                        shouldValidate: true,
                                    })
                                }
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`dossier-card text-left transition-all w-full p-4 sm:p-5 ${isSelected ? "ring-2 ring-[var(--red)] bg-white/5" : ""
                                    }`}
                                style={{
                                    border: isSelected ? "1px solid var(--red)" : "1px solid var(--border-strong)",
                                    position: "relative",
                                    overflow: "hidden"
                                }}
                            >
                                {/* Indicator line for selection */}
                                {isSelected && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--red)]" />
                                )}

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 border border-[var(--border-strong)]" style={{ background: isSelected ? "var(--red)" : "transparent" }}>
                                        <span className={`font-mono text-lg font-bold ${isSelected ? "text-white" : "text-white/40"}`}>
                                            {option.level}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bebas text-xl tracking-wider" style={{ color: isSelected ? "var(--text)" : "var(--text-muted)" }}>
                                            {option.title}
                                        </span>
                                        <span className="font-sans text-[14px] text-[var(--text-dim)] pt-1">
                                            {option.description}
                                        </span>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {e?.readinessLevel && (
                    <span
                        className="font-classified text-[9px] tracking-[0.12em] mt-2"
                        style={{ color: "var(--red)" }}
                        role="alert"
                    >
                        ⚠ {e.readinessLevel.message}
                    </span>
                )}
            </fieldset>
        </div>
    );
}
