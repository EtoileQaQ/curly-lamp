import Anthropic from "@anthropic-ai/sdk";

/**
 * Sur certains réseaux (antivirus, proxy, VPN, égress instable), les réponses
 * compressées (gzip) d'Anthropic arrivent tronquées, ce que Node signale par
 * l'erreur "Premature close". On force donc des réponses NON compressées en
 * imposant l'en-tête "Accept-Encoding: identity" sur chaque requête.
 */
const fetchWithoutCompression: typeof fetch = async (input, init) => {
  const headers = new Headers(init?.headers);
  headers.set("accept-encoding", "identity");
  return fetch(input, { ...init, headers });
};

/**
 * Client Anthropic partagé. La clé est lue dans .env.local (ANTHROPIC_API_KEY).
 * Ne jamais appeler ce client côté navigateur : uniquement dans les routes API
 * ou les server actions.
 */
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 60_000, // 60 s max par requête
  maxRetries: 3, // retente automatiquement en cas de coupure réseau
  fetch: fetchWithoutCompression,
});

// Le modèle utilisé partout dans Echo. Pour en changer, modifie cette seule ligne.
export const CLAUDE_MODEL = "claude-sonnet-4-6";

/**
 * Concatène le texte renvoyé par Claude (la réponse est une liste de "blocs").
 */
export function extractText(
  content: Anthropic.Messages.ContentBlock[]
): string {
  return content
    .filter((block): block is Anthropic.Messages.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

/**
 * Récupère le premier objet/tableau JSON présent dans une chaîne, même si le
 * modèle a ajouté du texte autour. Renvoie null si rien n'est exploitable.
 */
export function safeParseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return null;
    }
  }
}
