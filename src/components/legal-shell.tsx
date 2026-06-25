import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Gabarit commun aux pages légales : en-tête, titre, zone de texte mise en
// forme (titres/paragraphes/listes via variantes Tailwind), puis pied de page.
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#111]">
      <SiteHeader />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-medium md:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-[#999]">
            Dernière mise à jour : {updated}
          </p>

          <div className="mt-10 space-y-5 leading-relaxed text-[#666] [&_a]:text-[#6c63ff] [&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#111] [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-[#111] [&_li]:mt-1 [&_strong]:text-[#111] [&_ul]:list-disc [&_ul]:pl-6">
            {children}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
