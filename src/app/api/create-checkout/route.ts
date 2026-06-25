import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Sécurité : on n'utilise JAMAIS le priceId envoyé par le client (il pourrait
  // choisir n'importe quel prix de notre compte Stripe). On force la valeur de
  // confiance définie côté serveur.
  const priceId = process.env.STRIPE_PRICE_PRO;
  if (!priceId) {
    return NextResponse.json(
      { error: "Offre indisponible pour le moment." },
      { status: 500 }
    );
  }

  // E-mail de l'utilisateur Clerk (pré-rempli dans le checkout).
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  // Origine du site (localhost en dev, domaine en prod).
  const origin = new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      // On garde l'id Clerk pour relier le paiement à l'utilisateur dans le webhook.
      client_reference_id: userId,
      metadata: { userId },
      subscription_data: { metadata: { userId } },
      allow_promotion_codes: true,
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/#tarifs`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[/api/create-checkout]", err);
    return NextResponse.json(
      { error: "Impossible de lancer le paiement pour le moment." },
      { status: 500 }
    );
  }
}
