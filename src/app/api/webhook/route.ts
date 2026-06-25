import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Associe un Price ID Stripe à un plan interne.
function planFromPriceId(priceId?: string | null): "pro" | "agence" | "free" {
  if (priceId && priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  // Un seul plan payant pour l'instant : tout abonnement actif = "pro".
  return priceId ? "pro" : "free";
}

export async function POST(request: Request) {
  // Stripe a besoin du corps brut (non parsé) pour vérifier la signature.
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json(
      { error: "Signature ou secret webhook manquant" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature invalide";
    return NextResponse.json({ error: `Webhook: ${message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      // Paiement réussi → on active l'abonnement.
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;
        if (!userId) break;

        let plan: "pro" | "agence" | "free" = "pro";
        let status = "active";
        let periodEnd: string | null = null;

        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          plan = planFromPriceId(sub.items.data[0]?.price?.id);
          status = sub.status;
          const periodEndUnix = (sub as unknown as { current_period_end?: number })
            .current_period_end;
          periodEnd = periodEndUnix
            ? new Date(periodEndUnix * 1000).toISOString()
            : null;
        }

        await supabase
          .from("profiles")
          .update({
            stripe_customer_id: session.customer as string,
            plan,
            subscription_status: status,
            current_period_end: periodEnd,
          })
          .eq("user_id", userId);
        break;
      }

      // Abonnement supprimé/annulé → retour au plan gratuit.
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;

        const update = {
          plan: "free" as const,
          subscription_status: "canceled",
        };

        if (userId) {
          await supabase.from("profiles").update(update).eq("user_id", userId);
        } else {
          await supabase
            .from("profiles")
            .update(update)
            .eq("stripe_customer_id", sub.customer as string);
        }
        break;
      }

      // Paiement échoué → on marque le compte en impayé.
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await supabase
          .from("profiles")
          .update({ subscription_status: "past_due" })
          .eq("stripe_customer_id", invoice.customer as string);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur webhook";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
