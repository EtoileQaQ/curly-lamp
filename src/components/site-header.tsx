import Link from "next/link";

// En-tête partagé par les pages marketing/légales, identique à la navbar de la landing.
export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-[#6c63ff]">Echo</span>
          </Link>
        </div>
        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          <Link
            href="/#fonctionnalites"
            className="text-sm text-[#666] transition hover:text-[#111]"
          >
            Fonctionnalités
          </Link>
          <Link
            href="/#tarifs"
            className="text-sm text-[#666] transition hover:text-[#111]"
          >
            Tarifs
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Link
            href="/sign-in"
            className="hidden text-sm text-[#666] transition hover:text-[#111] sm:block"
          >
            Se connecter
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-[#6c63ff] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Essai gratuit
          </Link>
        </div>
      </div>
    </nav>
  );
}
