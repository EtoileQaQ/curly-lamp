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
    <div className="min-h-screen bg-white text-[#12101f]">
      <SiteHeader />

      <section className="bg-[#f8f7ff] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#6c63ff]">
            Légal
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-slate-500">
            Dernière mise à jour : {updated}
          </p>

          <div className="mt-10 rounded-2xl border border-[#e5e2ff] bg-white p-6 leading-relaxed text-slate-600 shadow-sm md:p-8 [&_a]:text-[#6c63ff] [&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#12101f] [&_h3]:mt-6 [&_h3]:font-bold [&_h3]:text-[#12101f] [&_li]:mt-1 [&_strong]:text-[#12101f] [&_ul]:list-disc [&_ul]:pl-6">
            {children}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
