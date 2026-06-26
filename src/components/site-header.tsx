import Link from "next/link";

// En-tête partagé par les pages marketing/légales, identique à la navbar de la landing.
export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#e5e2ff] bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex-1">
          <Link href="/" className="text-xl font-black tracking-tight">
            <span className="text-[#6c63ff]">Echo</span>
          </Link>
        </div>
        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          <Link
            href="/#fonctionnalites"
            className="text-sm text-slate-500 transition hover:text-[#12101f]"
          >
            Fonctionnalités
          </Link>
          <Link
            href="/#tarifs"
            className="text-sm text-slate-500 transition hover:text-[#12101f]"
          >
            Tarifs
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Link
            href="/sign-in"
            className="hidden text-sm text-slate-500 transition hover:text-[#12101f] sm:block"
          >
            Se connecter
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-[#6c63ff] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
          >
            Essai gratuit
          </Link>
        </div>
      </div>
    </nav>
  );
}
