import { getMemoryForPrompt } from "@/lib/memory";

/**
 * Récupère la mémoire identitaire d'un utilisateur et la transforme en un bloc
 * de texte prêt à être injecté dans un prompt système Anthropic.
 * Renvoie une chaîne vide si la mémoire est vide.
 */
export async function getIdentityMemoryBlock(userId: string): Promise<string> {
  const memory = await getMemoryForPrompt(userId);
  if (!memory) return "";

  return `

Voici des éléments qui définissent profondément cet utilisateur. Utilise-les pour que le post soit ancré dans sa réalité, pas juste dans son style :
${memory}
Si pertinent, fais référence à un de ces éléments naturellement dans le post (sans le citer mot pour mot de façon mécanique).`;
}
