import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { DashboardPosts, type Post } from "@/components/dashboard-posts";

const PAGE_SIZE = 20;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();

  // Si pas de profil, on renvoie vers l'onboarding.
  const { data: profile } = await supabase
    .from("profiles")
    .select("job, audience, goal")
    .eq("user_id", userId)
    .maybeSingle();

  if (!profile) {
    redirect("/onboarding");
  }

  // Pagination : on ne charge qu'une page de posts à la fois (20 max).
  const page = Math.max(1, Number(searchParams.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const {
    data: posts,
    count,
    error: postsError,
  } = await supabase
    .from("posts")
    .select("id, title, content, status, created_at", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (postsError) {
    console.error("[dashboard] lecture posts", postsError);
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <main className="min-h-screen overflow-x-hidden bg-card pb-28 text-foreground md:pb-0">
      <AppHeader />

      <section className="mx-auto w-full max-w-5xl overflow-x-hidden p-4 md:px-6 md:py-12 lg:px-8">
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm md:flex md:items-end md:justify-between md:p-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
              Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">
              Mes posts
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.job} · cible {profile.audience}
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="hidden bg-primary text-primary-foreground hover:opacity-90 md:inline-flex"
          >
            <Link href="/ideas">
              <Sparkles className="h-4 w-4" />
              Nouveau post
            </Link>
          </Button>
        </div>

        <div className="mt-6 md:mt-8">
          <DashboardPosts posts={(posts as Post[]) ?? []} />
        </div>

        {/* Pagination : visible uniquement s'il y a plus d'une page. */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {hasPrev ? (
              <Link
                href={`/dashboard?page=${page - 1}`}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                ← Précédent
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground/50">
                ← Précédent
              </span>
            )}

            <span className="text-sm text-muted-foreground">
              Page {page} / {totalPages}
            </span>

            {hasNext ? (
              <Link
                href={`/dashboard?page=${page + 1}`}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Suivant →
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground/50">
                Suivant →
              </span>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-border pb-24 pt-8 md:pb-0">
          <Link
            href="/onboarding"
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            Modifier mon profil et mes couleurs
          </Link>
        </div>
      </section>

      <div className="fixed bottom-[92px] left-1/2 z-40 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 md:hidden">
        <Button
          asChild
          size="lg"
          className="w-full bg-primary text-primary-foreground shadow-lg hover:opacity-90"
        >
          <Link href="/ideas">
            <Sparkles className="h-4 w-4" />
            Générer un post
          </Link>
        </Button>
      </div>
    </main>
  );
}
