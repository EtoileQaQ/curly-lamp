import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Contact — Echo",
  description: "Une question ? Écris-nous, on répond sous 24h ouvrées.",
};

const CHANNELS = [
  {
    icon: "💬",
    title: "Support & questions",
    desc: "Un souci, une question sur ton compte ou une fonctionnalité ?",
    email: "support@echo.fr",
  },
  {
    icon: "🤝",
    title: "Partenariats & agences",
    desc: "Tu gères plusieurs profils ou veux discuter d'une offre sur mesure ?",
    email: "contact@echo.fr",
  },
  {
    icon: "📣",
    title: "Presse & médias",
    desc: "Tu écris un article ou prépares une interview sur Echo ?",
    email: "presse@echo.fr",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-[#111]">
      <SiteHeader />

      <section className="bg-white px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#6c63ff]">
            Contact
          </span>
          <h1 className="mt-3 text-4xl font-medium md:text-5xl">
            Parlons-en.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[#666]">
            Une question, une idée, un bug ? On lit tout et on répond
            généralement sous 24h ouvrées.
          </p>
        </div>
      </section>

      <section className="bg-[#f8f8f8] px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {CHANNELS.map((c) => (
            <div
              key={c.title}
              className="flex flex-col rounded-2xl border-[0.5px] border-[#e5e5e5] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eeecff] text-xl">
                {c.icon}
              </div>
              <h2 className="mt-4 text-lg font-semibold">{c.title}</h2>
              <p className="mt-2 flex-1 text-sm text-[#666]">{c.desc}</p>
              <a
                href={`mailto:${c.email}`}
                className="mt-5 inline-block rounded-lg bg-[#6c63ff] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
              >
                {c.email}
              </a>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-[#666]">
          Tu préfères tester directement ?{" "}
          <a
            href="/sign-up"
            className="font-semibold text-[#6c63ff] hover:underline"
          >
            Crée ton compte gratuitement
          </a>{" "}
          — ton premier post est à 5 minutes.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
