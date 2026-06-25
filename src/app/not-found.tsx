import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-card px-6 text-center text-foreground">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-xl font-bold text-primary">
        404
      </div>
      <div>
        <h1 className="text-2xl font-medium tracking-tight">
          Page introuvable
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          La page que tu cherches n&apos;existe pas ou a été déplacée.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        Retour au tableau de bord
      </Link>
    </main>
  );
}
