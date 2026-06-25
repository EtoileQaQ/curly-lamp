import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Limiteur de débit partagé pour toutes les routes qui appellent l'IA (Claude).
 * Objectif : empêcher un utilisateur de spammer les appels et de faire exploser
 * la facture Anthropic.
 *
 * Stocké dans Upstash Redis (serverless), donc la limite est partagée entre
 * toutes les instances de l'application (contrairement à un compteur en mémoire).
 *
 * Variables d'environnement requises (.env.local) :
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

// Si Upstash n'est pas configuré, on désactive proprement le rate limiting
// (utile en développement local sans Redis) plutôt que de planter l'app.
const isConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const aiRatelimit = isConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      // 10 requêtes IA maximum par tranche glissante de 60 secondes, par utilisateur.
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "echo:ai",
      analytics: true,
    })
  : null;

const ideaGenerationRatelimit = isConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      // 30 lots d'idées par jour et par utilisateur. Un lot = 9 idées.
      // Suffisant pour un usage normal, mais bloque les régénérations infinies.
      limiter: Ratelimit.fixedWindow(30, "24 h"),
      prefix: "echo:ideas",
      analytics: true,
    })
  : null;

export type RateLimitResult = {
  success: boolean;
  /** Timestamp (ms) auquel le quota se réinitialise. */
  reset: number;
  /** Nombre de requêtes restantes dans la fenêtre. */
  remaining: number;
};

/**
 * Vérifie le quota d'un utilisateur pour les appels IA.
 * Renvoie toujours success=true si Upstash n'est pas configuré.
 */
export async function checkAiRateLimit(
  userId: string
): Promise<RateLimitResult> {
  if (!aiRatelimit) {
    return { success: true, reset: 0, remaining: Infinity };
  }
  const { success, reset, remaining } = await aiRatelimit.limit(userId);
  return { success, reset, remaining };
}

export async function checkIdeaGenerationLimit(
  userId: string
): Promise<RateLimitResult> {
  if (!ideaGenerationRatelimit) {
    return { success: true, reset: 0, remaining: Infinity };
  }
  const { success, reset, remaining } =
    await ideaGenerationRatelimit.limit(userId);
  return { success, reset, remaining };
}
