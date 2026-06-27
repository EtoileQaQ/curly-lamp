import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ONBOARDING_COOKIE = "echo_onboarding_user";

// Les pages listées ici exigent d'être connecté. Le reste (accueil, connexion,
// inscription) reste public.
const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/dashboard(.*)",
  "/ideas(.*)",
  "/write(.*)",
  "/post(.*)",
  "/memoire(.*)",
  "/profil(.*)",
  "/mes-themes(.*)",
  "/repurposing(.*)",
]);

const shouldHaveCompletedOnboarding = createRouteMatcher([
  "/dashboard(.*)",
  "/ideas(.*)",
  "/write(.*)",
  "/post(.*)",
  "/memoire(.*)",
  "/profil(.*)",
  "/mes-themes(.*)",
  "/repurposing(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

type MiddlewareProfile = {
  onboarding_completed: boolean | null;
  onboarding_step: number | null;
};

async function getOrCreateMiddlewareProfile(
  userId: string
): Promise<MiddlewareProfile | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    // Si la config Supabase manque, on laisse la page serveur gérer l'erreur.
    return null;
  }

  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };

  const selectResponse = await fetch(
    `${url}/rest/v1/profiles?user_id=eq.${encodeURIComponent(
      userId
    )}&select=onboarding_completed,onboarding_step`,
    { headers, cache: "no-store" }
  );

  if (!selectResponse.ok) {
    return null;
  }

  const rows = (await selectResponse.json()) as MiddlewareProfile[];
  if (rows[0]) return rows[0];

  const insertResponse = await fetch(`${url}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      user_id: userId,
      clerk_user_id: userId,
      onboarding_completed: false,
      onboarding_step: 0,
    }),
  });

  if (!insertResponse.ok) return null;
  const insertedRows = (await insertResponse.json()) as MiddlewareProfile[];
  return insertedRows[0] ?? null;
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  if (shouldHaveCompletedOnboarding(req) || isOnboardingRoute(req)) {
    const { userId } = await auth();
    if (!userId) return;

    // Cache navigateur : évite une requête Supabase à chaque navigation app
    // une fois l'onboarding terminé pour cet utilisateur précis.
    if (
      shouldHaveCompletedOnboarding(req) &&
      req.cookies.get(ONBOARDING_COOKIE)?.value === userId
    ) {
      return;
    }

    const profile = await getOrCreateMiddlewareProfile(userId);
    const completed = profile?.onboarding_completed === true;

    if (isOnboardingRoute(req) && completed) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (shouldHaveCompletedOnboarding(req) && !completed) {
      const response = NextResponse.redirect(new URL("/onboarding", req.url));
      response.cookies.delete(ONBOARDING_COOKIE);
      return response;
    }

    if (shouldHaveCompletedOnboarding(req) && completed) {
      const response = NextResponse.next();
      response.cookies.set(ONBOARDING_COOKIE, userId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }
  }
});

export const config = {
  matcher: [
    // Exécute le middleware sur tout sauf les fichiers statiques de Next.js.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ico|webp|woff2?|ttf|map)).*)",
    // Toujours sur les routes d'API.
    "/(api|trpc)(.*)",
  ],
};
