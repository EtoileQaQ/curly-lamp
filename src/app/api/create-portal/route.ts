import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Crée une session vers le Customer Portal de Stripe.
 * L'utilisateur peut y gérer/annuler son abonnement à tout moment
 * (obligation légale : résiliation libre).
 */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // On récupère l'identifiant client Stripe enregistré lors du paiement.
  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "Aucun abonnement actif à gérer." },
      { status: 400 }
    );
  }

  const origin = new URL(request.url).origin;

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/dashboard`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[/api/create-portal]", err);
    return NextResponse.json(
      { error: "Impossible d'ouvrir la gestion de l'abonnement pour le moment." },
      { status: 500 }
    );
  }
}
