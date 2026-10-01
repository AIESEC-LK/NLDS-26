import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RegistrationForm from "@/components/register/RegistrationForm";
import { REGISTRATION_OPEN } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Register — NLDS'26 | AIESEC in Sri Lanka",
  description:
    "Accept the mission. Register as a delegate for NLDS 2026 — National Leadership Development Seminar by AIESEC in Sri Lanka. 09–11 October 2026.",
};

export default function RegisterPage() {
  // Redirect to home if registrations haven't opened yet
  if (!REGISTRATION_OPEN) {
    redirect("/");
  }

  return (
    <main>
      <RegistrationForm />
    </main>
  );
}

