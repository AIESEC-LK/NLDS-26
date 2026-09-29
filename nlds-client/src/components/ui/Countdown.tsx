"use client";

import { useState, useEffect } from "react";
import { CLOSING_DEADLINE, REGISTRATION_OPEN } from "@/lib/constants";
import { getTimeRemaining } from "@/lib/utils";

export function useClosingStatus() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(CLOSING_DEADLINE));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize immediately in case of mismatch
    setTimeLeft(getTimeRemaining(CLOSING_DEADLINE));
    
    const id = setInterval(() => {
      setTimeLeft(getTimeRemaining(CLOSING_DEADLINE));
    }, 1000);
    
    return () => clearInterval(id);
  }, []);

  const isClosed = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return { timeLeft, isClosed, mounted };
}

const R = "#C41E3A";
const RD = "rgba(196,30,58,0.5)";

function Digit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center" style={{ gap: "8px" }}>
      {/* Card */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: "clamp(62px, 10vw, 88px)",
          height: "clamp(70px, 11vw, 96px)",
          background: "rgba(196,30,58,0.09)",
          border: `1px solid ${RD}`,
          boxShadow: `0 0 24px rgba(196,30,58,0.18), inset 0 0 18px rgba(196,30,58,0.06)`,
        }}
      >
        {/* Corner marks */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: R }} />
        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: R }} />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: R }} />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: R }} />

        {/* Scanlines */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(196,30,58,0.04) 3px,rgba(196,30,58,0.04) 4px)",
          }}
        />

        {/* Number */}
        <span
          className="font-display tabular-nums relative z-10 select-none"
          style={{
            fontSize: "clamp(2.1rem, 5vw, 3.2rem)",
            lineHeight: 1,
            color: R,
            textShadow: `0 0 22px ${RD}, 0 0 50px rgba(196,30,58,0.2)`,
            marginTop: "5px",
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </span>
      </div>

      <span
        className="font-classified select-none uppercase"
        style={{
          fontSize: "7.5px",
          letterSpacing: "0.32em",
          color: "rgba(196,30,58,0.7)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Sep() {
  return (
    <div className="flex flex-col gap-2" style={{ paddingBottom: "28px", opacity: 0.9 }}>
      <span className="w-[5px] h-[5px] rounded-full block" style={{ background: R, boxShadow: `0 0 8px ${RD}` }} />
      <span className="w-[5px] h-[5px] rounded-full block" style={{ background: R, boxShadow: `0 0 8px ${RD}` }} />
    </div>
  );
}

interface ClosingCountdownProps {
  title?: React.ReactNode;
  labelBefore: string;
  labelAfter: string;
}

export default function ClosingCountdown({ title, labelBefore, labelAfter }: ClosingCountdownProps) {
  const { timeLeft, isClosed, mounted } = useClosingStatus();

  // Show nothing until mounted to avoid hydration errors
  if (!mounted) return null;

  if (!REGISTRATION_OPEN) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 mt-4 mb-2 w-full max-w-[400px] mx-auto">
        {title && <div className="text-center mb-1">{title}</div>}
        <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
          <div className="h-[1px] flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, transparent, rgba(196,30,58,0.5))" }} />
          <span 
            className="font-classified text-[12px] sm:text-[14px] tracking-[0.25em] uppercase text-center font-bold"
            style={{
              color: "var(--red)",
              textShadow: "0 0 12px rgba(196,30,58,0.6)"
            }}
          >
            REGISTRATION FLASH ROUND COMING SOON
          </span>
          <div className="h-[1px] flex-1 max-w-[60px]" style={{ background: "linear-gradient(270deg, transparent, rgba(196,30,58,0.5))" }} />
        </div>
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 mt-4 mb-2">
        {title && <div className="text-center mb-2">{title}</div>}
        <div className="font-classified text-sm tracking-[0.2em] text-[var(--red)] uppercase font-bold text-center">
          {labelAfter}
        </div>
      </div>
    );
  }

  const dd = String(timeLeft.days).padStart(2, "0");
  const hh = String(timeLeft.hours).padStart(2, "0");
  const mm = String(timeLeft.minutes).padStart(2, "0");
  const ss = String(timeLeft.seconds).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 mt-4 mb-6 w-full mx-auto">
      {title && <div className="text-center">{title}</div>}
      
      {/* Tactical Label Row */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
        <div className="h-[1px] flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, transparent, rgba(196,30,58,0.5))" }} />
        <span 
          className="font-classified text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-center"
          style={{
            color: "var(--red)",
            textShadow: "0 0 10px rgba(196,30,58,0.4)"
          }}
        >
          {labelBefore}
        </span>
        <div className="h-[1px] flex-1 max-w-[60px]" style={{ background: "linear-gradient(270deg, transparent, rgba(196,30,58,0.5))" }} />
      </div>

      {/* Digits Display */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
        <Digit value={dd} label="DAYS" />
        <Sep />
        <Digit value={hh} label="HRS" />
        <Sep />
        <Digit value={mm} label="MIN" />
        <Sep />
        <Digit value={ss} label="SEC" />
      </div>
    </div>
  );
}
