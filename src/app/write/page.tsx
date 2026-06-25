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
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 overflow-x-hidden bg-card px-4 pb-28 text-center text-foreground md:px-6 md:pb-0">
        <p className="text-muted-foreground">
          Aucun sujet sélectionné. Choisis d&apos;abord une idée de post.
        </p>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/ideas">Voir mes idées</Link>
        </Button>
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
