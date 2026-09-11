import Hero from "@/components/hero/Hero";
import MissionBriefing from "@/components/sections/MissionBriefing";
import CountdownSection from "@/components/sections/CountdownSection";
import ArchivedMemories from "@/components/sections/ArchivedMemories";
import AcceptMission from "@/components/sections/AcceptMission";
import { SITE_URL, EVENT_START_DATE, EVENT_END_DATE, SITE_FULL_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: SITE_FULL_NAME,
    startDate: EVENT_START_DATE,
    endDate: EVENT_END_DATE,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Sri Lanka",
      address: {
        "@type": "PostalAddress",
        addressCountry: "LK",
      },
    },
    image: [`${SITE_URL}/images/Logos/NLDS%20LOGO.png`],
    description: SITE_DESCRIPTION,
    organizer: {
      "@type": "Organization",
      name: "AIESEC in Sri Lanka",
      url: "https://aiesec.lk",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <MissionBriefing />
      <CountdownSection />
      <ArchivedMemories />
      <AcceptMission />
    </main>
  );
}
