import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "À propos — Echo",
  description:
    "Pourquoi Echo existe : aider chacun à exister sur LinkedIn avec sa vraie voix, sans y passer des heures.",
};

const VALUES = [
  {
    icon: "🫵",
    title: "Ta voix d'abord",
    desc: "Echo ne te transforme pas en clone lisse. Il amplifie ta façon de penser et d'écrire.",
  },
  {
    icon: "⚡",
    title: "Le temps est sacré",
    desc: "Publier ne devrait pas voler tes soirées. On vise l'impact maximum en un minimum de temps.",
  },
  {
    icon: "🔍",
    title: "Honnêteté radicale",
    desc: "Pas de promesses magiques. Des outils concrets, des conseils mesurables, zéro bullshit.",
  },
];

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-white text-[#111]">
      <SiteHeader />

      {/* Hero / mission */}
      <section className="bg-white px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#6c63ff]">
            Notre mission
          </span>
          <h1 className="mx-auto mt-3 max-w-2xl text-4xl font-medium leading-tight md:text-5xl">
            Aider chacun à exister sur LinkedIn{" "}
            <span className="text-[#6c63ff]">avec sa vraie voix.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[#666]">
            On est convaincus que tout le monde a quelque chose d&apos;utile à
            dire. Ce qui manque, ce n&apos;est pas le talent — c&apos;est le temps,
            la régularité et la confiance. Echo s&apos;occupe du reste.
          </p>
        </div>
      </section>

      {/* Le problème */}
      <section className="bg-[#f8f8f8] px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-2xl font-medium md:text-3xl">
              Pourquoi on a créé Echo
            </h2>
            <div className="mt-5 space-y-4 text-[#666]">
              <p>
                LinkedIn est devenu l&apos;endroit où se jouent les
                opportunités : clients, recrutements, partenariats. Mais
                écrire régulièrement, bien, et sans y passer ses week-ends,
                c&apos;est presque impossible seul.
              </p>
              <p>
                Les outils d&apos;IA généralistes produisent des textes plats que
                tout le monde reconnaît. Les ghostwriters humains, eux, coûtent
                une fortune. Entre les deux, il n&apos;y avait rien.
              </p>
              <p>
                Alors on a construit Echo : une IA qui apprend{" "}
                <strong className="text-[#111]">qui tu es</strong> — ton style,
                tes convictions, tes anecdotes — pour écrire à ta place, sans
                jamais trahir ta voix.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#6c63ff]">
              Ce qui nous guide
            </span>
            <h2 className="mt-3 text-3xl font-medium md:text-4xl">
              Nos convictions.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 120}>
                <div className="h-full rounded-2xl border-[0.5px] border-[#e5e5e5] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eeecff] text-xl">
                    {v.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-[#666]">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-[#1a1a2e] px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-medium md:text-4xl">
            Rejoins les premiers créateurs Echo.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[#a9a9c0]">
            Sans carte bancaire. Sans engagement. Juste des posts qui te
            ressemblent.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3.5 font-semibold text-[#1a1a2e] transition hover:opacity-90"
          >
            Générer mes 4 premiers posts →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
