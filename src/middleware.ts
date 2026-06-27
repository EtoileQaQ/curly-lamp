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

async function getOnboardingStep(userId: string): Promise<number> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    // Si la config Supabase manque, on laisse la page serveur gérer l'erreur.
    return 4;
  }

  const response = await fetch(
    `${url}/rest/v1/profiles?user_id=eq.${encodeURIComponent(
      userId
    )}&select=onboarding_step`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return 0;
  }

  const rows = (await response.json()) as Array<{
    onboarding_step: number | null;
  }>;

  return rows[0]?.onboarding_step ?? 0;
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  if (shouldHaveCompletedOnboarding(req)) {
    const { userId } = await auth();
    if (!userId) return;

    // Cache navigateur : évite une requête Supabase à chaque navigation app
    // une fois l'onboarding terminé pour cet utilisateur précis.
    if (req.cookies.get(ONBOARDING_COOKIE)?.value === userId) {
      return;
    }

    const onboardingStep = await getOnboardingStep(userId);
    if (onboardingStep < 4) {
      const response = NextResponse.redirect(new URL("/onboarding", req.url));
      response.cookies.delete(ONBOARDING_COOKIE);
      return response;
    }

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
});

export const config = {
  matcher: [
    // Exécute le middleware sur tout sauf les fichiers statiques de Next.js.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ico|webp|woff2?|ttf|map)).*)",
    // Toujours sur les routes d'API.
    "/(api|trpc)(.*)",
  ],
};
