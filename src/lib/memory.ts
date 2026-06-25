import { createAdminClient } from "@/lib/supabase/admin";

export const MAX_MEMORY_ENTRIES = 20;

export type MemoryCategory =
  | "anecdote"
  | "position"
  | "expertise"
  | "retour_experience"
  | "style";

export type MemorySource = "onboarding" | "dialogue_generation" | "manuel";

export type MemoryEntry = {
  user_id: string;
  category: MemoryCategory;
  content: string;
  source: MemorySource;
};

export type StoredMemoryEntry = {
  id: string;
  user_id: string;
  category: MemoryCategory;
  content: string;
  source: MemorySource;
  created_at: string;
};

const CATEGORY_LABELS: Record<MemoryCategory, string> = {
  anecdote: "Anecdotes",
  position: "Positions",
  expertise: "Expertise",
  retour_experience: "Retours d'expérience",
  style: "Style d'écriture",
};

export async function getMemoryCount(userId: string): Promise<number> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("identity_memory")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("[memory] count", error);
    return 0;
  }

  return count ?? 0;
}

export async function getMemoryEntries(
  userId: string
): Promise<StoredMemoryEntry[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("identity_memory")
    .select("id, user_id, category, content, source, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[memory] list", error);
    return [];
  }

  return (data ?? []) as StoredMemoryEntry[];
}

// Vérifie si la mémoire est pleine.
export async function isMemoryFull(userId: string): Promise<boolean> {
  return (await getMemoryCount(userId)) >= MAX_MEMORY_ENTRIES;
}

// Ajoute une entrée (échoue si pleine).
export async function addMemoryEntry(
  userId: string,
  category: MemoryCategory,
  content: string,
  source: MemorySource
): Promise<{ success: boolean; error?: string }> {
  const trimmed = content.trim();
  if (!trimmed) return { success: false, error: "Contenu vide." };

  if (await isMemoryFull(userId)) {
    return { success: false, error: "Mémoire pleine." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("identity_memory").insert({
    user_id: userId,
    category,
    content: trimmed,
    source,
  });

  if (error) {
    console.error("[memory] insert", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Remplace l'entrée d'onboarding la plus ancienne (utilisé par le dialogue).
export async function replaceOldestEntry(
  userId: string,
  newEntry: MemoryEntry
): Promise<void> {
  const supabase = createAdminClient();
  const { data: oldest, error: selectError } = await supabase
    .from("identity_memory")
    .select("id")
    .eq("user_id", userId)
    .eq("source", "onboarding")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (selectError) {
    console.error("[memory] select oldest", selectError);
    return;
  }

  if (!oldest?.id) return;

  const { error } = await supabase
    .from("identity_memory")
    .update({
      category: newEntry.category,
      content: newEntry.content.trim(),
      source: newEntry.source,
      created_at: new Date().toISOString(),
    })
    .eq("id", oldest.id)
    .eq("user_id", userId);

  if (error) {
    console.error("[memory] replace oldest", error);
  }
}

// Ajoute une entrée de dialogue ; si la mémoire est pleine, remplace une vieille
// entrée issue de l'onboarding, jamais une entrée manuelle ou récente de dialogue.
export async function addDialogueMemoryEntry(
  userId: string,
  content: string
): Promise<void> {
  const entry: MemoryEntry = {
    user_id: userId,
    category: "retour_experience",
    content,
    source: "dialogue_generation",
  };

  const result = await addMemoryEntry(
    userId,
    entry.category,
    entry.content,
    entry.source
  );

  if (!result.success && result.error === "Mémoire pleine.") {
    await replaceOldestEntry(userId, entry);
  }
}

// Retourne toutes les entrées formatées pour injection dans un prompt Anthropic.
export async function getMemoryForPrompt(userId: string): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("identity_memory")
    .select("category, content")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[memory] prompt", error);
    return "";
  }

  if (!data || data.length === 0) return "";

  const grouped = new Map<MemoryCategory, string[]>();
  for (const row of data) {
    const category = row.category as MemoryCategory;
    grouped.set(category, [...(grouped.get(category) ?? []), row.content]);
  }

  return Array.from(grouped.entries())
    .map(([category, items]) => {
      const label = CATEGORY_LABELS[category] ?? category;
      return `- ${label} : ${items.map((item) => `« ${item} »`).join(" ; ")}`;
    })
    .join("\n");
}
