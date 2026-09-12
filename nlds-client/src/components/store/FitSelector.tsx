"use client";

interface FitSelectorProps {
  fitTypes: string[];
  selected: string | null;
  onChange: (fit: string) => void;
  error?: boolean;
}

export default function FitSelector({
  fitTypes,
  selected,
  onChange,
  error,
}: FitSelectorProps) {
  if (!fitTypes || fitTypes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      <div className="flex items-center justify-between w-full">
        <span
          className="font-classified"
          style={{
            fontSize: "9.5px",
            letterSpacing: "0.22em",
            color: error ? "var(--red)" : "var(--text-muted)",
          }}
        >
          SELECT FIT {error && "⚠"}
        </span>
        {selected && (
          <span
            className="font-classified"
            style={{
              fontSize: "10px",
              letterSpacing: "0.18em",
              color: "var(--red)",
            }}
          >
            {selected.toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {fitTypes.map((fit) => {
          const isActive = selected === fit;
          return (
            <button
              key={fit}
              onClick={() => onChange(fit)}
              className="flex-1 flex items-center justify-center py-2 px-3 transition-all duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                fontWeight: 500,
                color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                background: isActive
                  ? "rgba(196,30,58,0.15)"
                  : "rgba(255,255,255,0.03)",
                border: isActive
                  ? "1px solid var(--red)"
                  : error
                    ? "1px solid rgba(196,30,58,0.35)"
                    : "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
                boxShadow: isActive
                  ? "0 0 8px rgba(196,30,58,0.25), inset 0 0 4px rgba(196,30,58,0.1)"
                  : "none",
              }}
              aria-pressed={isActive}
              aria-label={`Fit: ${fit}`}
              id={`fit-${fit.toLowerCase()}`}
            >
              {fit.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
