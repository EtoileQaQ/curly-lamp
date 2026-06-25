import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Hash, Compass } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { categorizePosts } from "@/lib/themes";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { ExploreZoneButton } from "@/components/explore-zone-button";

export default async function MesThemesPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // On analyse les 30 derniers posts (sans IA, par mots-clés).
  const supabase = createAdminClient();
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("title, content")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (postsError) {
    console.error("[mes-themes] lecture posts", postsError);
  }

  const { explored, unexplored, total } = categorizePosts(posts ?? []);
  const max = explored[0]?.count ?? 1;

  return (
    <main className="min-h-screen overflow-x-hidden bg-card pb-28 text-foreground md:pb-0">
      <AppHeader />

      <section className="mx-auto w-full max-w-3xl overflow-x-hidden p-4 md:px-6 md:py-12 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
            <Hash className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-medium tracking-tight md:text-3xl lg:text-4xl">
              Mes thèmes
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Répartition de tes sujets sur tes {total} derniers posts.
            </p>
          </div>
        </div>

        {total === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-6 text-center md:mt-8 md:p-12">
            <p className="text-sm text-muted-foreground md:text-base">
              Aucun post pour l&apos;instant. Crée tes premiers posts pour voir
              tes thèmes apparaître.
            </p>
            <Button
              asChild
              className="mt-4 w-full bg-primary text-primary-foreground hover:opacity-90 sm:w-auto"
            >
              <Link href="/ideas">Générer mes idées de posts</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Thèmes explorés, en barres */}
            <div className="mt-6 space-y-4 md:mt-8">
              {explored.map((theme) => (
                <div key={theme.label} className="grid min-w-0 gap-2 md:flex md:items-center md:gap-3">
                  <span className="min-w-0 truncate text-sm font-medium text-foreground md:w-48 md:shrink-0">
                    {theme.label}
                  </span>
                  <div className="h-7 w-full min-w-0 overflow-hidden rounded-lg bg-accent md:h-6 md:flex-1">
                    <div
                      className="flex h-full items-center justify-end rounded-lg bg-primary px-2 text-xs font-bold text-primary-foreground"
                      style={{
                        width: `${Math.max((theme.count / max) * 100, 12)}%`,
                      }}
                    >
                      {theme.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Zones peu explorées */}
            {unexplored.length > 0 && (
              <div className="mt-8 md:mt-10">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground md:text-2xl">
                  <Compass className="h-4 w-4" />
                  Zones à explorer
                </h2>
                <p className="mt-1 text-sm text-muted-foreground md:text-base">
                  Des angles que tu n&apos;as pas (ou peu) abordés récemment :
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {unexplored.map((label) => (
                    <ExploreZoneButton key={label} zoneName={label} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
