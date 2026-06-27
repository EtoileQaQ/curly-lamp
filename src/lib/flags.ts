import { createAdminClient } from "@/lib/supabase/admin";

// Kill-switch global de génération IA, stocké dans la table `app_flags`.
// Mémoïsé quelques secondes pour éviter une requête Supabase à chaque appel IA,
// tout en réagissant rapidement à un changement (urgence de coût).
const CACHE_TTL_MS = 10_000;
let cached: { value: boolean; expires: number } | null = null;

export async function isApiDisabled(): Promise<boolean> {
  if (cached && cached.expires > Date.now()) {
    return cached.value;
  }

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("app_flags")
      .select("enabled")
      .eq("key", "api_disabled")
      .maybeSingle();

    const value = data?.enabled === true;
    cached = { value, expires: Date.now() + CACHE_TTL_MS };
    return value;
  } catch (err) {
    console.error("[flags] api_disabled", err);
    // En cas d'erreur de lecture, on ne bloque pas la génération (fail-open) :
    // un incident sur la table de flags ne doit pas casser tout le produit.
    return false;
  }
}

// Permet de forcer la relecture du flag (ex. juste après l'avoir basculé).
export function clearApiDisabledCache(): void {
  cached = null;
}
