import Stripe from "stripe";

/**
 * Initialisation paresseuse du client Stripe.
 *
 * IMPORTANT : on ne crée PAS le client au chargement du module. Pendant le build
 * (étape "Collecting page data"), Next.js importe ce fichier ; si on instanciait
 * `new Stripe(...)` ici avec une clé absente, le SDK lèverait une exception et
 * ferait échouer le build. On diffère donc la création jusqu'au premier usage
 * réel (au runtime, dans une route API ou une server action).
 */
let cachedStripe: Stripe | null = null;

function getStripe(): Stripe {
  if (cachedStripe) return cachedStripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY manquant : configure-le dans les variables d'environnement (Vercel) ou dans .env.local"
    );
  }

  cachedStripe = new Stripe(secretKey, {
    // On épingle la version d'API pour éviter tout changement de comportement
    // si Stripe fait évoluer sa version par défaut.
    apiVersion: "2026-05-27.dahlia",
    typescript: true,
  });

  return cachedStripe;
}

/**
 * Client Stripe côté serveur uniquement (ne jamais l'importer dans un composant
 * client). C'est un Proxy : le vrai client n'est créé qu'au premier accès, ce
 * qui rend le build insensible à une clé manquante tout en gardant l'API
 * habituelle (`stripe.checkout.sessions.create(...)`, etc.).
 */
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripe();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
