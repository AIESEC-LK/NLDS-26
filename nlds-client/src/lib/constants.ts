export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const SITE_NAME = "NLDS 2026";
export const SITE_FULL_NAME = "National Leadership Development Seminar 2026";
export const SITE_DESCRIPTION =
  "NLDS 2026 — The flagship leadership conference by AIESEC in Sri Lanka, uniting 250+ delegates from 11+ universities for three days of transformation.";

export const EVENT_YEAR = 2026;

/** ISO date strings — update when finalized */
export const EVENT_START_DATE = "2026-10-01T08:00:00+05:30";
export const EVENT_END_DATE = "2026-10-03T20:00:00+05:30";
export const CLOSING_DEADLINE = "2026-09-26T23:59:59+05:30"; // Shared closing time

export const AIESEC_SL_URL = "https://www.aiesec.lk";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/aiesec_in_srilanka/",
  linkedin: "https://www.linkedin.com/company/aiesec-in-sri-lanka/",
  facebook: "https://www.facebook.com/AIESECinSriLanka/",
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Team", href: "/#team" },
  { label: "Partners", href: "/partners" },
  { label: "Delegates", href: "/delegates" },
  { label: "Store", href: "/store" },
] as const;
