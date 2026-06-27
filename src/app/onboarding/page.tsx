import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FirstPostOnboarding } from "@/components/onboarding/FirstPostOnboarding";
import { getOrCreateProfile } from "@/lib/profile";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await getOrCreateProfile(userId);

  if (profile.onboarding_completed) {
    redirect("/dashboard");
  }

  return <FirstPostOnboarding profile={profile} />;
}
