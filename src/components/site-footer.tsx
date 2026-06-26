import Link from "next/link";

// Pied de page partagé sur la landing et toutes les pages marketing/légales.
export function SiteFooter() {
  const columns = [
    {
      title: "Produit",
      links: [
        { label: "Fonctionnalités", href: "/#fonctionnalites" },
        { label: "Tarifs", href: "/#tarifs" },
        { label: "Se connecter", href: "/sign-in" },
        { label: "Essai gratuit", href: "/sign-up" },
      ],
    },
    {
      title: "Entreprise",
      links: [
        { label: "À propos", href: "/a-propos" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Légal",
      links: [
        { label: "Mentions légales", href: "/mentions-legales" },
        { label: "Confidentialité", href: "/confidentialite" },
        { label: "CGU / CGV", href: "/cgu" },
      ],
    },
  ];

  return (
    <footer className="border-t border-[#2a2450] bg-[#12101f] px-6 py-14 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Marque */}
          <div>
            <div className="text-xl font-black tracking-tight">
              <span className="text-[#6c63ff]">Echo</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
            L&apos;IA qui t&apos;aide à ne plus chercher quoi publier sur LinkedIn.
            </p>
          </div>

          {/* Colonnes de liens */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-extrabold uppercase tracking-[0.13em] text-slate-600">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#2a2450] pt-6 text-sm text-slate-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Echo. Tous droits réservés.</p>
          <p>
            Powered by{" "}
            <Link
              href="https://delphes-int.fr/"
              className="transition hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              Delphes Int
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
