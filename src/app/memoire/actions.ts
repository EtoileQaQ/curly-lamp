"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  addMemoryEntry,
  type MemoryCategory,
  type MemorySource,
} from "@/lib/memory";

const CATEGORIES: MemoryCategory[] = [
  "anecdote",
  "position",
  "expertise",
  "retour_experience",
  "style",
];

type ActionState = {
  success?: boolean;
  error?: string;
};

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Non autorisé");
  return userId;
}

function isCategory(value: string): value is MemoryCategory {
  return CATEGORIES.includes(value as MemoryCategory);
}

export async function addManualMemoryEntry(
  category: string,
  content: string
): Promise<ActionState> {
  const userId = await requireUserId();
  const trimmed = content.trim();

  if (!isCategory(category)) return { error: "Catégorie invalide." };
  if (trimmed.length < 20) {
    return { error: "Ajoute au moins 20 caractères." };
  }

  const result = await addMemoryEntry(
    userId,
    category,
    trimmed,
    "manuel" satisfies MemorySource
  );

  if (!result.success) {
    return { error: result.error ?? "Impossible d'ajouter cette entrée." };
  }

  revalidatePath("/memoire");
  return { success: true };
}

export async function updateMemoryEntry(
  id: string,
  content: string
): Promise<ActionState> {
  const userId = await requireUserId();
  const trimmed = content.trim();

  if (trimmed.length < 20) {
    return { error: "Ajoute au moins 20 caractères." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("identity_memory")
    .update({ content: trimmed })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/memoire");
  return { success: true };
}

export async function deleteMemoryEntry(id: string): Promise<ActionState> {
  const userId = await requireUserId();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("identity_memory")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/memoire");
  return { success: true };
}
