import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  // En production, une clé manquante doit être visible tôt (logs de démarrage).
  console.warn("STRIPE_SECRET_KEY manquant dans .env.local");
}

/**
 * Client Stripe côté serveur uniquement (ne jamais l'importer dans un composant
 * client). On épingle la version d'API pour éviter tout changement de
 * comportement si Stripe fait évoluer sa version par défaut.
 */
export const stripe = new Stripe(secretKey ?? "", {
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
});
