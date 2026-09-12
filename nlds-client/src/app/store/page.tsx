import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import StoreFront from "@/components/sections/StoreFront";
import StoreCelebration from "@/components/store/StoreCelebration";

export const metadata: Metadata = {
  title: "Store — NLDS'26 | AIESEC in Sri Lanka",
  description:
    "Official NLDS'26 merchandise. Gear up for the mission. Limited edition items for the National Leadership Development Seminar 2026.",
};

export default function StorePage() {
  return (
    <main>
      <StoreCelebration />
      <PageHero
        label="MISSION STORE"
        fileNo="NLDS-2026-STORE"
        title="MISSION"
        subtitle="STORE"
        description="Official NLDS'26 merchandise. Wear the mission. Limited edition gear available while supplies last."
      />
      <StoreFront />
    </main>
  );
}
