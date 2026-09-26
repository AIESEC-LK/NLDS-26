"use client";

import Link from "next/link";

import { Lock } from "lucide-react";
import { useClosingStatus } from "@/components/ui/Countdown";

const FOOTER_LINKS = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/#mission" },
  { label: "CONFERENCE TEAM", href: "/team" },
  { label: "PARTNERS", href: "/partners" },
  { label: "STORE", href: "/store" },
  { label: "ROOM ALLOCATION", href: "/delegates", locked: true },
  { label: "REGISTER", href: "/register" },
];

const SOCIAL_LINKS = [
  { label: "INSTAGRAM ↗", href: "https://www.instagram.com/aiesecinsrilanka/" },
  {
    label: "LINKEDIN ↗",
    href: "https://www.linkedin.com/company/aieseclk/posts/?feedView=all",
  },
  { label: "FACEBOOK ↗", href: "https://www.facebook.com/AIESECLK" },
];

export default function Footer() {
  const { isClosed, mounted } = useClosingStatus();

  return (
    <footer
      id="footer"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Glowing top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(196,30,58,0.5), transparent)",
        }}
      />

      {/* Subtle grid bg */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Main wrapper with generous padding ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "5rem 4rem 3.5rem",
        }}
      >
        {/* ── Top section: Brand + Links ─────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "3rem",
            marginBottom: "4rem",
          }}
        >
          {/* Brand block */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              minWidth: "200px",
              maxWidth: "280px",
            }}
          >
            <Link
              href="/"
              style={{ textDecoration: "none", display: "inline-block" }}
            >
              <span
                className="font-display"
                style={{
                  fontSize: "3rem",
                  letterSpacing: "0.05em",
                  color: "white",
                  transition: "color 0.2s",
                }}
              >
                NLDS<span style={{ color: "var(--red)" }}>&apos;26</span>
              </span>
            </Link>
            <p
              className="font-classified"
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              NATIONAL LEADERSHIP DEVELOPMENT SEMINAR
              <br />
              AIESEC IN SRI LANKA
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Logos/AIESEC White LOGO.png"
              alt="AIESEC"
              style={{
                display: "block",
                height: "32px",
                width: "auto",
                objectFit: "contain",
                objectPosition: "left",
                opacity: 0.75,
                marginTop: "0.25rem",
                marginRight: "auto",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.25rem",
              }}
            >
              <span
                className="animate-blink"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--red)",
                  display: "inline-block",
                }}
              />
              <span
                className="font-classified"
                style={{
                  fontSize: "8.5px",
                  letterSpacing: "0.25em",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                MISSION STATUS: ACTIVE
              </span>
            </div>
          </div>

          {/* Links block */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4rem" }}>
            {/* Navigation */}
            <div>
              <p
                className="font-classified"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  color: "var(--text-dim)",
                  marginBottom: "1.5rem",
                  textTransform: "uppercase",
                }}
              >
                NAVIGATION
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                {FOOTER_LINKS.map((link) => {
                  const isLocked = link.locked || (link.label === "REGISTER" && mounted && isClosed);
                  const displayLabel = link.label === "REGISTER" && mounted && isClosed ? "REGISTRATION CLOSED" : link.label;

                  return (
                    <li key={link.label}>
                      {isLocked ? (
                        <div
                          title={link.label === "REGISTER" ? "Registration has ended" : "Opens on event day"}
                          className="font-classified flex items-center gap-2 cursor-not-allowed select-none"
                          style={{
                            fontSize: "12px",
                            letterSpacing: "0.22em",
                            color: "rgba(255,255,255,0.4)",
                          }}
                        >
                          <Lock size={12} className="flex-shrink-0" />
                          <span>{displayLabel}</span>
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          className="font-classified hover:text-[var(--red)] transition-colors duration-200"
                          style={{
                            fontSize: "12px",
                            letterSpacing: "0.22em",
                            color: "var(--text)",
                            textDecoration: "none",
                          }}
                        >
                          {displayLabel}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Follow */}
            <div>
              <p
                className="font-classified"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  color: "var(--text-dim)",
                  marginBottom: "1.5rem",
                  textTransform: "uppercase",
                }}
              >
                FOLLOW
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-classified"
                      style={{
                        fontSize: "12px",
                        letterSpacing: "0.22em",
                        color: "var(--text)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mission Info */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              <div>
                <p
                  className="font-classified"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.3em",
                    color: "var(--text-dim)",
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                  }}
                >
                  TENTATIVE MISSION DATE
                </p>
                <span
                  className="font-classified"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.2em",
                    color: "var(--text)",
                  }}
                >
                  09 — 11 OCTOBER 2026
                </span>
              </div>
              <div>
                <p
                  className="font-classified"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.3em",
                    color: "var(--text-dim)",
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                  }}
                >
                  MISSION VENUE
                </p>
                <span
                  className="font-classified"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.2em",
                    color: "var(--text-muted)",
                  }}
                >
                  TO BE ANNOUNCED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────── */}
        <div
          style={{
            height: "1px",
            background: "var(--border)",
            marginBottom: "2.5rem",
          }}
        />

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <p
            className="font-classified"
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            © 2026 AIESEC IN SRI LANKA. ALL RIGHTS RESERVED.
          </p>
          <p
            className="font-classified"
            style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            NLDS&apos;26 // OFFICIAL MISSION PLATFORM
          </p>
        </div>
      </div>
    </footer>
  );
}
