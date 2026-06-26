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
          La page blanche du lundi,{" "}
            <span className="text-[#6c63ff]"> c'est terminé.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[480px] text-[#666]">
          Echo trouve les idées, structure le message et rédige dans ton style. Tu n&apos;as plus qu&apos;à publier.
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
              Voir comment ça marche
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#666]">
            <span className="flex items-center gap-1.5">
              <span className="text-[#6c63ff]">✓</span> 4 posts gratuits pour tester
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#6c63ff]">✓</span> Résultats en moins de 10 min
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#6c63ff]">✓</span> Sans carte bancaire
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
            Ce que tu vis chaque semaine
            </span>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-medium md:text-4xl">
            Tu sais que tu devrais publier.
              <br />
              Mais ça ne se fait jamais.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#666]">
            Ce n&apos;est pas un manque de volonté. 
            C&apos;est que passer de "je devrais publier" à un vrai post demande beaucoup plus d&apos;énergie que ça n&apos;en a l&apos;air.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {[
              "Je devrais publier quelque chose cette semaine.",
              "Mais sur quoi ? Je ne vois pas d'angle",
              "Bon, je verrai ça demain.",
              "Je n'ai rien publié. Encore."",
            ].map((pain, i) => (
              <Reveal key={pain} delay={i * 100}>
                <div className="flex h-full items-start gap-3 rounded-xl border-[0.5px] border-[#e5e5e5] bg-[#f8f8f8] p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <span className="mt-0.5 text-lg leading-none text-[#ef4444]">
                    –
                  </span>
                  <p className="text-sm text-[#444]">{pain}</p>
                </div>
            
            <div className="text-center">
            <p className="mx-auto mt-4 max-w-xl text-[#666]">
            Ce n&apos;est pas que tu n&apos;as rien à dire. C&apos;est qu'il n&apos;y a personne pour te poser la bonne question au bon moment.
            </p>
            <span className="text-sm font-semibold uppercase tracking-wide text-[#6c63ff]">
            Echo fait exactement ça.
            </span>
          </div>
              </Reveal>
            ))}
          </div>

          {/* Comment ça marche — 3 étapes concrètes */}
          <div className="mt-24 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#6c63ff]">
            Ce qu&apos;Echo change dès la première session
            </span>
            <h2 className="mt-3 text-3xl font-medium md:text-4xl">
            Tu arrives sans idée. Tu repars avec un post prêt.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#666]">
            La première chose qu&apos;Echo fait quand tu n&apos;as rien en tête : te proposer 9 idées adaptées à ton métier, ta cible et tes sujets passés.
            Tu choisis une direction. Il te pose deux ou trois questions pour que le post soit concret et personnel. Puis il rédige dans ton style.
            En moins de 10 minutes, de zéro à prêt à publier.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Tu poses le point de départ",
                desc: "Pas besoin d'arriver avec un sujet. Pas besoin de passer deux heures à reformuler ce qu'une IA générique t'a rendu.",
              },
              {
                step: "2",
                title: "Echo pose les bonnes questions",
                desc: "Pour éviter le post vide ou générique, il te demande une anecdote, un chiffre, une position. Ce que tu sais, mais que tu n'aurais pas pensé à mettre.",
              },
              {
                step: "3",
                title: "Tu publies avec confiance",
                desc: "Tu récupères un post structuré, fidèle à ton style et facile à ajuster. Tu copies, tu publies quand tu veux.",
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
                  "Tu bloques devant la page blanche. Tu fermes l'onglet.",
                  "Tu publies deux fois par mois, dans le meilleur des cas.",
                  "Tes posts IA sonnent propres, mais interchangeables.",
                  "Tu hésites avant de publier parce que "ça ne te ressemble pas vraiment"",
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
                  "Tu arrives sans idée. En un clic, tu en as 9. Tu choisis.",
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
                q: "Je n'ai vraiment aucune idée de quoi publier. Echo peut m'aider ?",
                a: "C'est exactement le cas d'usage principal. Echo commence par te proposer 9 idées adaptées à ton métier, ta cible et tes sujets passés. Tu n'as pas à arriver avec quoi que ce soit.",
              },
              {
                q: "Est-ce que mes posts vont sonner comme de l'IA ?",
                a: "Echo réduit ce risque en s'appuyant sur ta mémoire éditoriale : anecdotes, positions, style et anciens posts. Quand la matière manque, il te pose des questions avant de générer — plutôt que de remplir avec du vide.",
              },
              {
                q: "Combien de temps ça prend vraiment ?",
                a: "L'onboarding dure quelques minutes. Ensuite, générer un post prend moins de 10 minutes du départ à la relecture.",
              },
              {
                q: "C'est quoi la différence avec ChatGPT ?",
                a: "Echo retient ton style et tes sujets déjà traités. Il détecte quand une idée est trop vague, te pose des questions pour éviter le contenu générique, et mesure le dwell time de ton post avant que tu publies.",
              },
              {
                q: "Est-ce que ça publie directement sur LinkedIn ?",
                a: "Non. Tu gardes le contrôle total. Echo prépare le texte et le visuel : tu copies, tu publies quand tu veux",
              },
              {
                q: "Je peux annuler quand je veux ?",
                a: "Oui. Les abonnés peuvent gérer et annuler leur abonnement à tout moment, directement depuis l'application.",
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
