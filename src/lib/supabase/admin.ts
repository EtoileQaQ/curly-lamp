import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase "admin" : il utilise la clé secrète service_role et ne doit
 * être appelé QUE côté serveur (server actions, route handlers). Il contourne
 * la sécurité RLS, donc on s'assure toujours de filtrer par l'identifiant
 * de l'utilisateur Clerk (user_id).
 *
 * Le client est mémoïsé au niveau module (singleton) : inutile d'en recréer un
 * à chaque appel, ils partagent la même configuration sans état de session.
 */
let cachedClient: SupabaseClient | null = null;

export function createAdminClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Variables Supabase manquantes : vérifie NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local"
    );
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cachedClient;
}
