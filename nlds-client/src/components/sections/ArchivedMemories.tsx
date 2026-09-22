"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ── Types ─────────────────────────────────────────── */
type CardType = "gallery" | "film";

interface MemoryCard {
  id: string;
  fileNum: string;
  edition: string;
  date: string;
  coords: string;
  title: string;
  subtitle: string;
  status: "ARCHIVED" | "MEMORY RECOVERED" | "RESTRICTED ACCESS";
  type: CardType;
  caption: string;
  images?: string[]; // Cloudinary URLs — up to 10
  timestamp: string;
  classification: string;
  note: string;
}

/* ── Archival data ──────────────────────────────────── */
const MEMORIES: MemoryCard[] = [
  {
    id: "01",
    fileNum: "MEM-NLDS25-001",
    edition: "NLDS'25 EDITION",
    date: "NOV 2025",
    coords: "6.9271°N / 79.8612°E",
    title: "FIELD HIGHLIGHTS",
    subtitle: "Moments from the front lines",
    status: "MEMORY RECOVERED",
    type: "gallery",
    caption:
      "Selected frames recovered from NLDS'25 field operations. 270+ operatives, 3 days of high-intensity leadership missions across Sri Lanka.",
    images: [
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591168/565646989_1223927079782015_25125892466108142_n_bcs5ba.jpg", // 01
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591169/566246539_1223927329781990_8284568885312634037_n_u6n0en.jpg", // 02
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591171/566248598_1223929143115142_3057621255956916376_n_a30h8k.jpg", // 03
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591166/565073233_1223931486448241_7667211820858219830_n_c5vwlg.jpg", // 04
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591167/564771820_1223948089779914_2988539675561097372_n_jthlg9.jpg", // 05
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591168/565663583_1223948193113237_3350892479167177681_n_o9on9o.jpg", // 06
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591175/565651631_1225455946295795_3406666120953231335_n_tgwhkf.jpg", // 07
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591183/568287037_1225455776295812_704809359654714512_n_ntbby1.jpg", // 08
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591182/566226298_1225456232962433_5110394865440818267_n_heevcp.jpg", // 09
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591181/568262177_1225457039629019_8718331261583370447_n_myskli.jpg", // 10
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591181/565924030_1225452446296145_1295927776338078882_n_gmwx7a.jpg", // 11
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591177/565778487_1225453712962685_441618948757874449_n_l6k8x1.jpg", // 12
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591176/565764748_1225452082962848_6352350495239519275_n_tnp4k0.jpg", // 13
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591190/571116597_1228118572696199_7382186628250061950_n_kl86hp.jpg", // 14
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591191/571142506_1228120119362711_7822180569853533684_n_y8yalb.jpg", // 15
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591189/569504270_1228122172695839_5499246612296751673_n_tgttoo.jpg", // 16
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591192/571158095_1228120159362707_3384596598249505808_n_srhqcp.jpg", // 17
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591593/572336437_1228120712695985_7653258150541034195_n_wlk08e.jpg", // 18
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591197/571199642_1228121116029278_686156072037816826_n_fwfnz4.jpg", // 19
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787591194/571174338_1228117002696356_4610205807903310978_n_ackrwu.jpg", // 20
    ],
    timestamp: "2025:11:07 09:14:32",
    classification: "ARCHIVAL RECORD",
    note: "Some frames redacted for operational security.",
  },
  {
    id: "02",
    fileNum: "MEM-NLDS25-002",
    edition: "GALA NIGHT",
    date: "NOV 2025 // FINAL NIGHT",
    coords: "6.8895°N / 79.8517°E",
    title: "GALA NIGHT",
    subtitle: "The night they were recognised",
    status: "ARCHIVED",
    type: "gallery",
    caption:
      "Classified images from the Gala Ceremony — NLDS'25's final night. Outstanding operatives recognised for leadership under pressure.",
    images: [
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787585794/571256432_1230052342502822_2293923886028176538_n_pcqsfi.jpg",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787585799/571448603_1230049729169750_7279052457716443494_n_zrkgc7.jpg",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787585796/571343355_1230060149168708_5640428504050073784_n_tueotu.jpg",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787585791/570115345_1230055212502535_6374022892192885500_n_bfbofq.jpg",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1790090444/571230527_1230047985836591_1872667235688214022_n_chhir9.jpg",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787585792/571231448_1230048152503241_1678166474363396444_n_afnzjd.jpg",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787585792/571134186_1230047842503272_4615556096503260860_n_azin0m.jpg",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787585794/571134314_1230060489168674_7994456661734102270_n_fwlgwj.jpg",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787585796/571334185_1230060615835328_3917540636811162534_n_fvkksx.jpg",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787585798/571365832_1230055029169220_4613873526737992373_n_wzmbwm.jpg",
    ],
    timestamp: "2025:11:09 21:47:55",
    classification: "RESTRICTED ARCHIVE",
    note: "██████████ ACCESS CONTROLLED.",
  },
  {
    id: "03",
    fileNum: "MEM-NLDS25-003",
    edition: "POST-MISSION DEBRIEF",
    date: "DEC 2025",
    coords: "RECORDED // SRI LANKA",
    title: "THE AFTER MOVIE",
    subtitle: "Full mission debrief — NLDS'25",
    status: "RESTRICTED ACCESS",
    type: "film",
    caption:
      "The complete visual record of NLDS'25. Every moment, every mission, every transformation — captured and archived for future operatives.",
    timestamp: "2025:12:01 00:00:00",
    classification: "DECLASSIFIED FOOTAGE",
    note: "Duration: classified. Viewing may cause permanent leadership upgrades.",
  },
];

/* ── Noise texture ──────────────────────────────────── */
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`;

/* ── Status badge colours ───────────────────────────── */
function statusColour(s: MemoryCard["status"]) {
  if (s === "MEMORY RECOVERED") return "#4ade80";
  if (s === "ARCHIVED") return "rgba(255,255,255,0.35)";
  return "var(--red)";
}

/* ── Image Carousel ─────────────────────────────────── */
function ImageCarousel({ images }: { images: string[] }) {
  const slots = images; // supports any length
  const total = slots.length;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const go = useCallback(
    (next: number) => {
      const d = next > current ? 1 : -1;
      setDirection(d);
      setCurrent((next + total) % total);
    },
    [current, total],
  );

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % total);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, total]);

  const slide = slots[current];

  return (
    <div
      style={{ width: "100%", position: "relative", userSelect: "none" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          overflow: "hidden",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: NOISE_SVG,
            opacity: 0.06,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            width: 12,
            height: 12,
            borderTop: "1px solid rgba(255,255,255,0.2)",
            borderLeft: "1px solid rgba(255,255,255,0.2)",
            zIndex: 3,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 12,
            height: 12,
            borderTop: "1px solid rgba(255,255,255,0.2)",
            borderRight: "1px solid rgba(255,255,255,0.2)",
            zIndex: 3,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            width: 12,
            height: 12,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            borderLeft: "1px solid rgba(255,255,255,0.2)",
            zIndex: 3,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 12,
            height: 12,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            borderRight: "1px solid rgba(255,255,255,0.2)",
            zIndex: 3,
          }}
        />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={{
              enter: (d: number) => ({
                x: d > 0 ? "100%" : "-100%",
                opacity: 0,
              }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({
                x: d > 0 ? "-100%" : "100%",
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.32, 0, 0.67, 0] }}
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
          >
            {slide ? (
              <img
                src={slide}
                alt={`Frame ${current + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: NOISE_SVG,
                    opacity: 0.08,
                  }}
                />
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.2em",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  IMG_{String(current + 1).padStart(3, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "var(--text-muted)",
                    letterSpacing: "0.15em",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  AWAITING UPLOAD
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 12,
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.18em",
              background: "rgba(6,6,8,0.6)",
              padding: "2px 6px",
              backdropFilter: "blur(4px)",
            }}
          >
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "0.75rem",
        }}
      >
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {slots.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                width: i === current ? "18px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background:
                  i === current ? "var(--red)" : "rgba(255,255,255,0.15)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => go(current - 1)}
            style={{
              width: "32px",
              height: "32px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(196,30,58,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(196,30,58,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.12)";
            }}
          >
            ←
          </button>
          <button
            onClick={() => go(current + 1)}
            style={{
              width: "32px",
              height: "32px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(196,30,58,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(196,30,58,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.12)";
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Film reel placeholder ──────────────────────────── */
const BASE_SRC =
  "https://www.youtube.com/embed/IZCI-6-Jiu4?si=ZapPeV9vsx0kVEvw";
const PLAY_SRC = `${BASE_SRC}&autoplay=1&mute=1`;

function FilmPlaceholder({ hovered }: { hovered: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState(BASE_SRC);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setSrc(entry.isIntersecting ? PLAY_SRC : BASE_SRC);
      },
      { threshold: 0.5 }, // fires when 50% of the player is visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Film strip top perfs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "4px",
          paddingLeft: "2px",
        }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "14px",
              height: "10px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "1px",
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* YouTube embed */}
      <motion.div
        ref={wrapRef}
        animate={{ opacity: hovered ? 1 : 0.85 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "100%",
          position: "relative",
          aspectRatio: "16/9",
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <iframe
          src={src}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </motion.div>

      {/* Film strip bottom perfs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginTop: "4px",
          paddingLeft: "2px",
        }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "14px",
              height: "10px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "1px",
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Individual memory card ─────────────────────────── */
function MemoryCard({ card, index }: { card: MemoryCard; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--surface-1)",
        border: "1px solid rgba(255,255,255,0.07)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "border-color 0.3s",
        borderColor: hovered ? "rgba(196,30,58,0.3)" : "rgba(255,255,255,0.07)",
      }}
    >
      {/* Paper grain texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: NOISE_SVG,
          opacity: 0.05,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Subtle red scan sweep on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ left: "-30%" }}
            animate={{ left: "130%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "linear" }}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "30%",
              background:
                "linear-gradient(90deg, transparent, rgba(196,30,58,0.05), transparent)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}
      </AnimatePresence>

      {/* Top red accent bar */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "var(--red)",
          transformOrigin: "left",
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 3,
          padding: "clamp(1.25rem, 3vw, 2rem)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {/* ── Header row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.2em",
              }}
            >
              {card.fileNum}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.18em",
              }}
            >
              {card.edition}
            </span>
          </div>

          {/* Status badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "3px 8px",
              border: `1px solid ${statusColour(card.status)}`,
              opacity: 0.75,
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: statusColour(card.status),
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.22em",
                color: statusColour(card.status),
              }}
            >
              {card.status}
            </span>
          </div>
        </div>

        {/* ── Redacted decorative lines ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {[72, 55, 38].map((w, i) => (
            <div
              key={i}
              style={{
                height: "6px",
                width: `${w}%`,
                background: "rgba(255,255,255,0.06)",
                borderRadius: "1px",
              }}
            />
          ))}
        </div>

        {/* ── Title ── */}
        <div>
          <h3
            style={{
              fontFamily: "'Barlow Condensed', 'Oswald', sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              color: "var(--text)",
              marginBottom: "0.35rem",
            }}
          >
            {card.title}
          </h3>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.18em",
            }}
          >
            {card.subtitle.toUpperCase()}
          </p>
        </div>

        {/* ── Media area ── */}
        {card.type === "gallery" && card.images ? (
          <ImageCarousel images={card.images} />
        ) : (
          <FilmPlaceholder hovered={hovered} />
        )}

        {/* ── Caption ── */}
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "14px",
            lineHeight: 1.7,
            color: "var(--text-dim)",
            letterSpacing: "0.05em",
          }}
        >
          {card.caption}
        </p>

        {/* ── Handwritten-style note ── */}
        <div
          style={{
            borderLeft: "2px solid rgba(196,30,58,0.3)",
            paddingLeft: "0.75rem",
          }}
        >
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "12px",
              color: "var(--text-muted)",
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            {card.note}
          </p>
        </div>

        {/* ── Footer metadata ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: "0.75rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.18em",
              }}
            >
              {card.coords}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.15em",
              }}
            >
              TIMESTAMP: {card.timestamp}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "3px",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.18em",
              }}
            >
              {card.classification}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "20px",
                color: "rgba(255,255,255,0.1)",
                lineHeight: 1,
              }}
            >
              {card.id}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Section ────────────────────────────────────────── */
export default function ArchivedMemories() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="archive"
      className="w-full py-24 md:py-32 relative"
      style={{ background: "var(--bg)", marginTop: "clamp(4rem, 10vw, 8rem)" }}
    >
      {/* Subtle aged paper grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: 1,
        }}
      />
      {/* Global noise grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: NOISE_SVG,
          opacity: 0.04,
          pointerEvents: "none",
        }}
      />

      {/* Centered content */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingLeft: "clamp(1.5rem, 6vw, 5rem)",
          paddingRight: "clamp(1.5rem, 6vw, 5rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            marginBottom: "4rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            maxWidth: "56rem",
          }}
        >
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                height: "1px",
                width: "2.5rem",
                background: "var(--red)",
              }}
            />
            <span className="label-classified">ARCHIVE // NLDS'25</span>
            <div
              style={{
                height: "1px",
                width: "2.5rem",
                background: "var(--red)",
              }}
            />
          </div>

          {/* Headline */}
          <h2
            className="font-display leading-[0.88] tracking-[0.03em]"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", color: "var(--text)" }}
          >
            ARCHIVED
            <br />
            MEMORIES
          </h2>

          {/* Subtext */}
          <p
            style={{
              maxWidth: "36rem",
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              fontWeight: 300,
              lineHeight: 1.7,
            }}
          >
            Recovered records from the NLDS'25 field operations. Moments,
            milestones, and memories — archived for the next generation of
            operatives.
          </p>

          {/* Redacted metadata row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginTop: "0.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.2em",
              }}
            >
              EDITION: NLDS'25
            </span>
            <div
              style={{
                width: "1px",
                height: "12px",
                background: "rgba(255,255,255,0.1)",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.2em",
              }}
            >
              STATUS: DECLASSIFIED
            </span>
            <div
              style={{
                width: "1px",
                height: "12px",
                background: "rgba(255,255,255,0.1)",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.2em",
              }}
            >
              FILES: 03
            </span>
          </div>
        </motion.div>

        {/* ── Cards grid ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            width: "100%",
            maxWidth: "72rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {MEMORIES.map((card, i) => (
            <MemoryCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* ── Footer note ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          style={{
            marginTop: "2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              height: "1px",
              width: "3rem",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.22em",
              textAlign: "center",
            }}
          >
            RECORDS DECLASSIFIED — AIESEC IN SRI LANKA // ARCHIVE DIVISION
          </p>
        </motion.div>
      </div>
    </section>
  );
}
