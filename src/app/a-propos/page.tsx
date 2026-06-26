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
    icon: "01",
    title: "Ta voix d'abord",
    desc: "Tu n'as pas besoin d'écrire comme tout le monde pour être visible. Echo t'aide à mettre en valeur ce qui te rend unique, au lieu de lisser ton style.",
  },
  {
    icon: "02",
    title: "Ton temps a de la valeur",
    desc: "Ton expertise mérite d'être partagée, pas de te coûter toutes tes soirées. Echo réduit le temps passé à écrire pour que tu puisses te concentrer sur ton activité.",
  },
  {
    icon: "03",
    title: "Des promesses réalistes",
    desc: "Pas de promesses magiques. L'objectif d'Echo est simple : t'aider à publier plus facilement, plus régulièrement et avec des contenus qui te ressemblent vraiment.",
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
          Tu as des idées, des expériences et une expertise qui méritent d&apos;être vues.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[#666]">
          Tu n&apos;as pas besoin d&apos;avoir une liste d&apos;idées pour publier sur LinkedIn. 
          Tu as déjà la matière. Echo t&apos;aide à la retrouver, à l&apos;organiser et à la transformer en publications qui te ressemblent.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-[#666]">
          Echo existe pour que tu puisses prendre la parole sur LinkedIn sans y consacrer tes soirées, 
          sans devenir copywriter et sans avoir l&apos;impression de publier des textes écrits par quelqu&apos;un d&apos;autre.
          </p>
        </div>
      </section>

      {/* Le problème */}
      <section className="bg-[#f8f8f8] px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-2xl font-medium md:text-3xl">
              Pourquoi Echo existe
            </h2>
            <div className="mt-5 space-y-4 text-[#666]">
              <p>
                Aujourd&apos;hui, une grande partie des opportunités professionnelles naissent sur LinkedIn : 
                nouveaux clients, recrutements, partenariats ou invitations.
              </p>
              <p>
              Le problème, c&apos;est que publier régulièrement demande du temps, 
              de l&apos;énergie et une discipline que peu de personnes peuvent maintenir sur la durée.
              </p>
              <p>
              Tu peux utiliser une IA généraliste, mais elle repart de zéro à chaque conversation.
              Tu peux faire appel à un ghostwriter, mais cela représente un budget important et demande malgré tout beaucoup d&apos;échanges.
              </p>
              <p>
              Echo a été conçu pour t&apos;offrir une troisième voie.
              </p>
              <p>
              Au lieu de générer un texte impersonnel, Echo apprend progressivement à te connaître : 
              ta façon de t&apos;exprimer, tes convictions, tes anecdotes et les sujets qui comptent pour toi.
              </p>
              <p>
              Tu écris plus vite, tu restes fidèle à ta voix et tu peux publier avec régularité sans repartir de zéro à chaque fois.
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
              Ce qui guide Echo
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
