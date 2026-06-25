"use server";

import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export type OnboardingState = {
  error?: string;
};

const MAX_MEMORY_ENTRIES = 20;

type MemoryCategory =
  | "anecdote"
  | "position"
  | "expertise"
  | "retour_experience"
  | "style";

type MemoryPayload = {
  user_id: string;
  category: MemoryCategory;
  content: string;
  source: "onboarding";
};

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return userId;
}

function getTrimmed(formData: FormData, name: string) {
  return ((formData.get(name) as string | null) ?? "").trim();
}

function getTrimmedAll(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function buildMemoryEntries(
  userId: string,
  formData: FormData
): MemoryPayload[] {
  const entries: MemoryPayload[] = [];

  for (const content of getTrimmedAll(formData, "anecdotes")) {
    entries.push({ user_id: userId, category: "anecdote", content, source: "onboarding" });
  }

  for (const content of getTrimmedAll(formData, "positions")) {
    entries.push({ user_id: userId, category: "position", content, source: "onboarding" });
  }

  const expertise = getTrimmed(formData, "expertise");
  if (expertise) {
    entries.push({
      user_id: userId,
      category: "expertise",
      content: expertise,
      source: "onboarding",
    });
  }

  const retourExperience = getTrimmed(formData, "retour_experience");
  if (retourExperience) {
    entries.push({
      user_id: userId,
      category: "retour_experience",
      content: retourExperience,
      source: "onboarding",
    });
  }

  const samplePosts = getTrimmed(formData, "sample_posts");
  if (samplePosts) {
    entries.push({
      user_id: userId,
      category: "style",
      content: samplePosts,
      source: "onboarding",
    });
  }

  return entries;
}

async function saveProfileAndMemory(formData: FormData, onboardingStep: number) {
  const userId = await requireUserId();
  const job = (formData.get("job") as string)?.trim();
  const audience = (formData.get("audience") as string)?.trim();
  const goal = (formData.get("goal") as string)?.trim();
  const samplePosts = (formData.get("sample_posts") as string)?.trim();

  if (!job || !audience || !goal) {
    return {
      error: "Merci de remplir au minimum : métier, cible et objectif.",
    };
  }

  const payload = {
    user_id: userId,
    job,
    audience,
    goal,
    sample_posts: samplePosts || null,
    onboarding_step: onboardingStep,
    updated_at: new Date().toISOString(),
  };

  const supabase = createAdminClient();
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "user_id" });

  if (profileError) {
    return { error: `Erreur d'enregistrement : ${profileError.message}` };
  }

  // On remplace les entrées d'onboarding existantes pour éviter les doublons
  // quand l'utilisateur revient modifier son formulaire.
  const { error: deleteError } = await supabase
    .from("identity_memory")
    .delete()
    .eq("user_id", userId)
    .eq("source", "onboarding");

  if (deleteError) {
    return { error: `Erreur mémoire : ${deleteError.message}` };
  }

  const entries = buildMemoryEntries(userId, formData);
  if (entries.length === 0) {
    return {};
  }

  const { count } = await supabase
    .from("identity_memory")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const remainingSlots = Math.max(0, MAX_MEMORY_ENTRIES - (count ?? 0));
  const entriesToInsert = entries.slice(0, remainingSlots);

  if (entriesToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("identity_memory")
      .insert(entriesToInsert);

    if (insertError) {
      return { error: `Erreur mémoire : ${insertError.message}` };
    }
  }

  return {};
}

// Sauvegarde les étapes complétées quand l'utilisateur navigue dans le stepper.
export async function saveOnboardingProgress(
  formData: FormData
): Promise<OnboardingState> {
  const step = Number(formData.get("onboarding_step") ?? 1);
  return saveProfileAndMemory(formData, Math.min(Math.max(step, 1), 3));
}

// Finalise l'onboarding puis redirige vers le dashboard.
export async function completeOnboarding(
  formData: FormData
): Promise<OnboardingState> {
  const result = await saveProfileAndMemory(formData, 4);
  if (result.error) {
    return result;
  }
  const { userId } = await auth();
  if (userId) {
    cookies().set("echo_onboarding_user", userId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  redirect("/dashboard");
}
