import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RegistrationForm from "@/components/register/RegistrationForm";
import { CLOSING_DEADLINE } from "@/lib/constants";
import { getTimeRemaining } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Register — NLDS'26 | AIESEC in Sri Lanka",
  description:
    "Accept the mission. Register as a delegate for NLDS 2026 — National Leadership Development Seminar by AIESEC in Sri Lanka. 09–11 October 2026.",
};

export default function RegisterPage() {
  const timeLeft = getTimeRemaining(CLOSING_DEADLINE);
  const isClosed = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isClosed) {
    redirect("/");
  }

  return (
    <main>
      <RegistrationForm />
    </main>
  );
}
