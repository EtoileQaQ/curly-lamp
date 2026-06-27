import { createAdminClient } from "@/lib/supabase/admin";

type LogAiUsageInput = {
  userId: string;
  route: string;
  model?: string;
  inputTokens?: number | null;
  outputTokens?: number | null;
};

/**
 * Enregistre la consommation de tokens d'un appel Anthropic dans `ai_usage`.
 *
 * IMPORTANT : ce logging ne doit JAMAIS faire échouer la requête utilisateur.
 * En cas d'erreur d'écriture, on se contente de la tracer côté serveur.
 */
export async function logAiUsage({
  userId,
  route,
  model,
  inputTokens,
  outputTokens,
}: LogAiUsageInput): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("ai_usage").insert({
      user_id: userId,
      route,
      model: model ?? null,
      input_tokens: inputTokens ?? 0,
      output_tokens: outputTokens ?? 0,
    });
  } catch (err) {
    console.error("[usage] log", err);
  }
}
