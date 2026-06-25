import { createAdminClient } from "@/lib/supabase/admin";

// Nombre de posts inclus dans le plan gratuit.
export const FREE_POST_LIMIT = 4;

type PlanInfo = {
  plan: string;
  subscription_status: string | null;
};

// Récupère le plan + le statut d'abonnement (valeurs par défaut = gratuit).
async function getPlanInfo(userId: string): Promise<PlanInfo> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("plan, subscription_status")
    .eq("user_id", userId)
    .maybeSingle();
  return {
    plan: data?.plan ?? "free",
    subscription_status: data?.subscription_status ?? null,
  };
}

// Vrai uniquement si l'utilisateur a un abonnement Pro RÉELLEMENT actif.
// Un paiement échoué (past_due) ou annulé ne donne donc plus l'accès Pro.
export async function isPro(userId: string): Promise<boolean> {
  const { plan, subscription_status } = await getPlanInfo(userId);
  return plan === "pro" && subscription_status === "active";
}

// Vrai si un utilisateur NON-Pro a atteint la limite de posts.
// Le compteur inclut TOUS les posts enregistrés (write + repurposing).
export async function hasReachedFreeLimit(userId: string): Promise<boolean> {
  // Les comptes Pro actifs ne sont jamais limités.
  if (await isPro(userId)) return false;

  const supabase = createAdminClient();
  const { count } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  return (count ?? 0) >= FREE_POST_LIMIT;
}
