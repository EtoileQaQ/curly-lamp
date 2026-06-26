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
    <footer className="bg-[#1a1a2e] px-6 py-14 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Marque */}
          <div>
            <div className="text-xl font-bold tracking-tight">
              <span className="text-[#6c63ff]">Echo</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-[#a9a9c0]">
              L&apos;IA qui écrit tes posts LinkedIn avec ta voix, tes
              convictions et tes anecdotes.
            </p>
          </div>

          {/* Colonnes de liens */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#a9a9c0] transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-[#6b6b85] sm:flex-row">
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
