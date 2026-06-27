"use server";

import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getOrCreateProfile,
  updateProfile,
  type Persona,
  type Profile,
} from "@/lib/profile";

export type OnboardingState = {
  error?: string;
};

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return userId;
}

function clampStep(step: number) {
  return Math.min(Math.max(step, 0), 4);
}

export async function loadOnboardingProfile(): Promise<Profile> {
  const userId = await requireUserId();
  return getOrCreateProfile(userId);
}

export async function saveOnboardingStep(step: number): Promise<OnboardingState> {
  try {
    const userId = await requireUserId();
    await updateProfile(userId, { onboarding_step: clampStep(step) });
    return {};
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Impossible de sauvegarder l'étape.",
    };
  }
}

export async function savePersona(persona: Persona): Promise<OnboardingState> {
  try {
    const userId = await requireUserId();
    await updateProfile(userId, { persona, onboarding_step: 1 });
    return {};
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Impossible de sauvegarder le profil.",
    };
  }
}

export async function saveFirstPostIdea(
  idea: string
): Promise<OnboardingState> {
  try {
    const userId = await requireUserId();
    const trimmed = idea.trim();
    if (trimmed.length < 30) {
      return { error: "Ton idée doit contenir au moins 30 caractères." };
    }
    await updateProfile(userId, {
      first_post_idea: trimmed,
      onboarding_step: 3,
    });
    return {};
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Impossible de sauvegarder l'idée.",
    };
  }
}

export async function saveGeneratedFirstPost(
  post: string
): Promise<OnboardingState> {
  try {
    const userId = await requireUserId();
    const trimmed = post.trim();
    if (!trimmed) {
      return { error: "Le post généré est vide." };
    }
    await updateProfile(userId, {
      first_post_generated: trimmed,
      onboarding_step: 4,
    });
    return {};
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Impossible de sauvegarder le post.",
    };
  }
}

export async function completeFirstPostOnboarding(): Promise<OnboardingState> {
  const userId = await requireUserId();
  await updateProfile(userId, {
    onboarding_completed: true,
    onboarding_step: 4,
  });
  cookies().set("echo_onboarding_user", userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/dashboard");
}

export async function saveFirstPostAsDraft(post: string): Promise<{
  id?: string;
  error?: string;
}> {
  try {
    const userId = await requireUserId();
    const content = post.trim();
    if (!content) return { error: "Le post est vide." };

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        title: "Premier post Echo",
        content,
        status: "ready",
      })
      .select("id")
      .single();

    if (error) {
      return { error: `Impossible d'enregistrer le post : ${error.message}` };
    }

    await updateProfile(userId, {
      onboarding_completed: true,
      onboarding_step: 4,
    });
    cookies().set("echo_onboarding_user", userId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return { id: data.id as string };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer le premier post.",
    };
  }
}

// Compatibilité avec l'ancien composant OnboardingForm, conservé dans le repo.
export async function saveOnboardingProgress(
  _formData?: FormData
): Promise<OnboardingState> {
  return { error: "Cet onboarding a été remplacé par le flow premier post." };
}

export async function completeOnboarding(
  _formData?: FormData
): Promise<OnboardingState> {
  return completeFirstPostOnboarding();
}
