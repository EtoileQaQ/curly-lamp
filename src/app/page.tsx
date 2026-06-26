import Link from "next/link";
import { BackToTop } from "@/components/back-to-top";
import { SocialProofBar } from "@/components/social-proof-bar";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { PricingSection } from "@/components/pricing-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#111]">
      {/* 1. Barre d'annonce */}
      <div className="bg-[#1a1a2e] py-2.5 text-center text-sm text-white">
        <span className="font-bold text-[#6c63ff]">Accès anticipé</span> · 4
        posts gratuits pour tester Echo · Sans carte bancaire
      </div>

      {/* 2. Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex-1">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-[#6c63ff]">Echo</span>
            </Link>
          </div>
          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <a
              href="#fonctionnalites"
              className="text-sm text-[#666] transition hover:text-[#111]"
            >
              Fonctionnalités
            </a>
            <a
              href="#tarifs"
              className="text-sm text-[#666] transition hover:text-[#111]"
            >
              Tarifs
            </a>
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

      {/* 3. Section Hero */}
      <section className="bg-white px-6 py-20 text-center md:py-28">
        <div className="flex items-center gap-2 bg-[#eeecff] border border-[#c4bfff] rounded-full px-4 py-1.5 text-xs font-medium text-[#534AB7] mb-5 w-fit mx-auto">
        <div className="w-2 h-2 rounded-full bg-[#6c63ff] animate-pulse" />
          Lancement en cours · Accès anticipé
        </div>
        <div className="mx-auto max-w-3xl">
          <h1 className="mx-auto mt-8 max-w-2xl text-[32px] font-medium leading-tight md:text-[48px]">
            1 mois de posts LinkedIn.{" "}
            <span className="text-[#6c63ff]">30 minutes.</span>
            {" "}Ton style.
          </h1>

          <p className="mx-auto mt-6 max-w-[480px] text-[#666]">
            Publie régulièrement. Attire les bonnes personnes. Développe ce que tu construis.
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="w-full rounded-lg bg-[#6c63ff] px-6 py-3 text-center font-semibold text-white transition hover:opacity-90 sm:w-auto"
            >
              Générer mes 4 premiers posts →
            </Link>
            <a
              href="/#demo"
              className="w-full rounded-lg border border-[#e5e5e5] px-6 py-3 text-center font-semibold text-[#111] transition hover:bg-[#f8f8f8] sm:w-auto"
            >
              Voir un exemple
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#666]">
            <span className="flex items-center gap-1.5">
              <span className="text-[#6c63ff]">✓</span> Annulation à tout moment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#6c63ff]">✓</span> Résultats en 5 min
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#6c63ff]">✓</span> Sans CB pour l&apos;essai
            </span>
          </div>
        </div>
      </section>

      {/* 4. Barre de preuve sociale (compteurs animés) */}
      <SocialProofBar />

      {/* 5. Section Valeur (orientée conversion : douleur → solution → avant/après) */}
      <section id="fonctionnalites" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          {/* Bloc douleur */}
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#6c63ff]">
              Le vrai problème
            </span>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-medium md:text-4xl">
              Tu sais que LinkedIn peut tout changer.
              <br />
              Mais tu n&apos;arrives pas à t&apos;y tenir.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#666]">
              Ce n&apos;est pas un manque de volonté. C&apos;est que poster
              régulièrement, bien, et sans y passer des heures, c&apos;est presque
              impossible seul.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {[
              "Chaque semaine, tu te promets d'être plus actif. Chaque semaine, LinkedIn repasse au second plan.",
              "Tu as des choses à dire, mais elles restent floues au moment d'écrire.",
              "Quand tu passes par une IA générique, le texte pourrait venir de n'importe qui.",
              "À compétence égale, c'est souvent celui qui est visible qui gagne.",
            ].map((pain, i) => (
              <Reveal key={pain} delay={i * 100}>
                <div className="flex h-full items-start gap-3 rounded-xl border-[0.5px] border-[#e5e5e5] bg-[#f8f8f8] p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <span className="mt-0.5 text-lg leading-none text-[#ef4444]">
                    –
                  </span>
                  <p className="text-sm text-[#444]">{pain}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Comment ça marche — 3 étapes concrètes */}
          <div className="mt-24 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#6c63ff]">
              Comment ça marche
            </span>
            <h2 className="mt-3 text-3xl font-medium md:text-4xl">
              Tu passes d&apos;une idée floue à un post prêt à publier.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#666]">
              Pas besoin de devenir copywriter, ni de passer deux heures à
              discuter avec ChatGPT. Echo te guide jusqu&apos;à un contenu clair,
              personnel et exploitable.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Tu poses le point de départ",
                desc: "Une idée, une anecdote, un article ou un sujet que tu veux défendre. Même si c'est encore brouillon, Echo sait par où commencer.",
              },
              {
                step: "2",
                title: "Echo trouve le bon angle",
                desc: "Il clarifie ton message, fait ressortir ce qui est intéressant et te demande les précisions utiles pour éviter le post plat ou générique.",
              },
              {
                step: "3",
                title: "Tu publies avec confiance",
                desc: "Tu récupères un post structuré, fidèle à ton ton et facile à ajuster. Tu gagnes du temps sans sacrifier ta personnalité.",
              },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 120}>
                <div className="h-full rounded-2xl border-[0.5px] border-[#e5e5e5] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6c63ff] text-base font-bold text-white">
                    {s.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-[#666]">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Avant / Après */}
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            <Reveal className="rounded-2xl border-[0.5px] border-[#e5e5e5] bg-[#f8f8f8] p-7">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#999]">
                Sans Echo
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Tu perds du temps à chercher une idée, puis encore du temps à l'écrire.",
                  "Tu finis par publier moins souvent que prévu, même quand tu as des choses à dire.",
                  "Tes posts générés par IA sonnent propres, mais interchangeables.",
                  "Tu hésites avant de publier parce que le texte ne ressemble pas vraiment à toi.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-[#666]">
                    <span className="mt-0.5 text-[#ef4444]">–</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal
              delay={150}
              className="rounded-2xl border-2 border-[#6c63ff] bg-white p-7 shadow-lg"
            >
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#6c63ff]">
                Avec Echo
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Tu transformes une idée brouillon en post clair sans repartir de zéro.",
                  "Tu publies plus régulièrement parce que le plus dur est déjà fait.",
                  "Echo s'appuie sur tes expériences pour éviter le contenu générique.",
                  "Tu gardes le dernier mot avant publication, avec un texte prêt à ajuster.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-[#111]">
                    <span className="mt-0.5 text-[#6c63ff]">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* CTA de section */}
          <div className="mt-12 text-center">
            <Link
              href="/sign-up"
              className="inline-block rounded-lg bg-[#6c63ff] px-7 py-3.5 font-semibold text-white transition hover:opacity-90"
            >
              Générer mes 4 premiers posts →
            </Link>
            <p className="mt-3 text-sm text-[#666]">
              Gratuit · Sans carte bancaire · 4 posts inclus pour tester
            </p>
          </div>
        </div>
      </section>

      {/* 7. Section Tarifs */}
      <PricingSection />

      {/* 7bis. Section FAQ (traitement des objections — après les tarifs) */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#6c63ff]">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl font-medium md:text-4xl">
              Les questions que tu te poses.
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {[
              {
                q: "Est-ce que mes posts vont sonner comme de l'IA ?",
                a: "Echo réduit ce risque en s'appuyant sur ta mémoire : anecdotes, positions, expertise et anciens posts. Si la matière manque, il te pose des questions avant de générer.",
              },
              {
                q: "Combien de temps ça me prend vraiment ?",
                a: "L'onboarding prend quelques minutes. Ensuite, générer un post est rapide : tu choisis une idée, Echo vérifie la matière, puis rédige en direct.",
              },
              {
                q: "En quoi c'est différent de ChatGPT ?",
                a: "Echo garde une mémoire éditoriale modifiable, détecte quand une idée est trop vague, t'évite les posts génériques et structure tes contenus pour LinkedIn.",
              },
              {
                q: "Et si je ne sais pas quoi écrire ?",
                a: "Echo te propose 9 idées adaptées à ton métier et à ta cible, en un clic. Tu peux aussi coller un article, des notes ou un transcript : il en fait un post.",
              },
              {
                q: "Est-ce que ça publie automatiquement sur LinkedIn ?",
                a: "Non, tu gardes le contrôle total. Echo prépare le texte et le visuel ; tu copies-colles et tu publies quand tu le souhaites.",
              },
              {
                q: "Je peux annuler quand je veux ?",
                a: "Oui. Les abonnés peuvent gérer et annuler leur abonnement depuis le portail Stripe, accessible directement dans l'application.",
              },
              {
                q: "Mes données sont-elles en sécurité ?",
                a: "Oui. Ton profil et tes posts restent privés et ne servent qu'à générer ton propre contenu.",
              },
            ].map((item, i) => (
              <Reveal key={item.q} delay={i * 80}>
                <details className="group rounded-xl border border-[#e5e5e5] bg-white p-5 transition-colors hover:border-[#6c63ff]/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-[#111] [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <span className="text-xl leading-none text-[#6c63ff] transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#666]">
                    {item.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>

          {/* CTA de section */}
          <div className="mt-10 rounded-2xl bg-[#f8f8f8] p-8 text-center">
            <p className="text-lg font-medium text-[#111]">
              Encore un doute ? Le plus simple, c&apos;est d&apos;essayer.
            </p>
            <p className="mt-1 text-sm text-[#666]">
              C&apos;est gratuit, sans carte bancaire, et tu peux tester avec 4
              posts inclus.
            </p>
            <Link
              href="/sign-up"
              className="mt-5 inline-block rounded-lg bg-[#6c63ff] px-7 py-3.5 font-semibold text-white transition hover:opacity-90"
            >
              Générer mes 4 premiers posts →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Section Témoignages */}
      <section id="demo" className="bg-[#f8f8f8] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#6c63ff]">
              Ils l&apos;utilisent déjà
            </span>
            <h2 className="mt-3 text-3xl font-medium md:text-4xl">
              Ce qu&apos;ils en disent.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                initials: "SL",
                name: "Sophie L.",
                role: "Consultante RH indépendante",
                quote:
                  "Le vrai déclic, c'est la mémoire. Echo reprend mes angles et me pousse à ajouter du concret quand je suis trop vague.",
              },
              {
                initials: "MK",
                name: "Marc K.",
                role: "Dirigeant PME, secteur bâtiment",
                quote:
                  "Le score dwell time et le garde-fou thématique m'aident à améliorer mes posts avant de publier.",
              },
              {
                initials: "AL",
                name: "Axel L.",
                role: "Freelance marketing digital",
                quote:
                  "Je colle mes notes, Echo extrait la matière et me demande des précisions quand il manque une vraie expérience.",
              },
            ].map((t, i) => (
              <Reveal key={t.initials} delay={i * 120}>
                <div className="h-full rounded-xl border border-[#e5e5e5] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <div className="text-sm font-medium text-[#6c63ff]">
                    Retour utilisateur
                  </div>
                  <p className="mt-3 italic text-[#444]">“{t.quote}”</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eeecff] text-sm font-bold text-[#6c63ff]">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-[#666]">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Section CTA Final */}
      <section className="bg-[#1a1a2e] px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-medium md:text-4xl">
            Ton prochain post peut devenir le début d&apos;une vraie présence sur LinkedIn.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[#a9a9c0]">
            Sans carte bancaire pour tester. Des posts moins génériques.
            Une expertise qui devient visible.
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="w-full rounded-lg bg-white px-6 py-3 text-center font-semibold text-[#1a1a2e] transition hover:opacity-90 sm:w-auto"
            >
              Générer mes 4 premiers posts →
            </Link>
            <a
              href="/#demo"
              className="w-full rounded-lg border border-white/40 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              Voir une démo
            </a>
          </div>

          <p className="mt-8 text-xs text-[#6b6b85]">
            Garantie 30 jours · Annulation en 1 clic
          </p>
        </div>
      </section>

      {/* Pied de page */}
      <SiteFooter />

      {/* Bouton retour en haut (apparaît au scroll) */}
      <BackToTop />
    </div>
  );
}
