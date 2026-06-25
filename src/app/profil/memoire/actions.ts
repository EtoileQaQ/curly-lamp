"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPro } from "@/lib/plan";

const VALID_CATEGORIES = [
  "conviction",
  "anecdote",
  "position",
  "valeur",
  "experience_cle",
];

const MAX_ENTRIES = 20;

export type MemoryActionState = { error?: string };

// Ajoute une entrée à la mémoire identitaire (max 20).
export async function addMemory(
  category: string,
  content: string
): Promise<MemoryActionState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Non autorisé" };
  }

  // La Mémoire identitaire est réservée au plan Pro.
  if (!(await isPro(userId))) {
    return { error: "Fonctionnalité réservée au plan Pro." };
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return { error: "Le contenu ne peut pas être vide." };
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return { error: "Catégorie invalide." };
  }

  const supabase = createAdminClient();

  // On vérifie qu'on ne dépasse pas la limite.
  const { count } = await supabase
    .from("identity_memory")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if ((count ?? 0) >= MAX_ENTRIES) {
    return { error: `Limite atteinte (${MAX_ENTRIES} entrées maximum).` };
  }

  const { error } = await supabase
    .from("identity_memory")
    .insert({ user_id: userId, category, content: trimmed });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profil/memoire");
  return {};
}

// Supprime une entrée de la mémoire.
export async function deleteMemory(id: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Non autorisé");
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("identity_memory")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/profil/memoire");
}
