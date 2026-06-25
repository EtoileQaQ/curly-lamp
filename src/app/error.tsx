"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // On loggue l'erreur côté client pour le suivi (visible en console / monitoring).
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-card px-6 text-center text-foreground">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-2xl">
        ⚠️
      </div>
      <div>
        <h1 className="text-2xl font-medium tracking-tight">
          Une erreur est survenue
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Quelque chose s&apos;est mal passé de notre côté. Tu peux réessayer ;
          si le problème persiste, reviens dans quelques minutes.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Réessayer
        </button>
        <a
          href="/dashboard"
          className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          Retour au tableau de bord
        </a>
      </div>
    </main>
  );
}
