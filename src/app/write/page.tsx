import Link from "next/link";
import { PostEditor } from "@/components/post-editor";
import { Button } from "@/components/ui/button";

export default function WritePage({
  searchParams,
}: {
  searchParams: { idea?: string; angle?: string };
}) {
  const idea = searchParams.idea?.trim();
  const angle = searchParams.angle?.trim();

  // Si on arrive ici sans sujet, on renvoie vers la page des idées.
  if (!idea) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-card px-4 pb-28 text-center text-foreground md:px-6 md:pb-0">
        <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
            Rédaction
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight">
            Aucun sujet sélectionné
          </h1>
          <p className="mt-3 text-muted-foreground">
            Choisis d&apos;abord une idée de post pour lancer la rédaction.
          </p>
          <Button asChild className="mt-5 w-full sm:w-auto">
            <Link href="/ideas">Voir mes idées</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <PostEditor
      idea={idea}
      initialInstruction={
        angle
          ? `Traite ce sujet sous cet angle précis et original : ${angle}`
          : undefined
      }
    />
  );
}
