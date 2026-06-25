import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  OnboardingForm,
  type OnboardingMemoryEntry,
  type OnboardingProfile,
} from "@/components/onboarding-form";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // On précharge le profil existant pour permettre la modification.
  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "job, audience, goal, sample_posts, onboarding_step"
    )
    .eq("user_id", userId)
    .maybeSingle();

  const { data: memory } = await supabase
    .from("identity_memory")
    .select("category, content, source, created_at")
    .eq("user_id", userId)
    .eq("source", "onboarding")
    .order("created_at", { ascending: true });

  return (
    <OnboardingForm
      profile={(profile as OnboardingProfile) ?? null}
      memory={(memory as OnboardingMemoryEntry[]) ?? []}
    />
  );
}
