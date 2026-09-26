"use client";

import { useState, useEffect } from "react";
import { CLOSING_DEADLINE } from "@/lib/constants";
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

function DigitBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div 
        className="relative flex items-center justify-center w-[52px] h-[60px] sm:w-[68px] sm:h-[80px]"
        style={{
          background: "rgba(10,10,12,0.6)",
          border: "1px solid rgba(196,30,58,0.2)",
          boxShadow: "0 0 15px rgba(196,30,58,0.1), inset 0 0 15px rgba(196,30,58,0.05)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[var(--red)] opacity-80" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[var(--red)] opacity-80" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[var(--red)] opacity-80" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[var(--red)] opacity-80" />
        
        {/* Subtle scanline overlay inside digit box */}
        <div 
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.08]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(196,30,58,1) 2px, rgba(196,30,58,1) 4px)",
          }}
        />

        <span 
          className="font-display text-2xl sm:text-4xl tabular-nums relative z-20"
          style={{
            color: "var(--red)",
            textShadow: "0 0 12px rgba(196,30,58,0.5)",
            lineHeight: 1,
            marginTop: "4px" // optical adjustment for font
          }}
        >
          {value}
        </span>
      </div>
      <span 
        className="font-classified text-[8px] sm:text-[9px] tracking-[0.25em] text-[var(--red)] uppercase"
        style={{ opacity: 0.8 }}
      >
        {label}
      </span>
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

  const hours = String(timeLeft.days * 24 + timeLeft.hours).padStart(2, "0");
  const minutes = String(timeLeft.minutes).padStart(2, "0");
  const seconds = String(timeLeft.seconds).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 mt-3 mb-5 w-full max-w-[400px] mx-auto">
      {title && <div className="text-center mb-1">{title}</div>}
      
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
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <DigitBlock value={hours} label="HRS" />
        
        <div className="flex flex-col gap-1.5 sm:gap-2 pb-5 sm:pb-6">
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--red)] opacity-60" style={{ boxShadow: "0 0 8px rgba(196,30,58,0.6)" }} />
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--red)] opacity-60" style={{ boxShadow: "0 0 8px rgba(196,30,58,0.6)" }} />
        </div>
        
        <DigitBlock value={minutes} label="MIN" />
        
        <div className="flex flex-col gap-1.5 sm:gap-2 pb-5 sm:pb-6">
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--red)] opacity-60" style={{ boxShadow: "0 0 8px rgba(196,30,58,0.6)" }} />
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--red)] opacity-60" style={{ boxShadow: "0 0 8px rgba(196,30,58,0.6)" }} />
        </div>
        
        <DigitBlock value={seconds} label="SEC" />
      </div>
    </div>
  );
}
