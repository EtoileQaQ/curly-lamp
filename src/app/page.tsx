import Link from "next/link";
import { BackToTop } from "@/components/back-to-top";
import { SocialProofBar } from "@/components/social-proof-bar";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { PricingSection } from "@/components/pricing-section";
import { LinkedInPostMockup } from "@/components/linkedin-post-mockup";
import { Button } from "@/components/ui/button";

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
            <span className="text-[#6c63ff]"> c&apos;est terminé.</span>
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
            C&apos;est que passer de &ldquo;je devrais publier&rdquo; à un vrai post demande beaucoup plus d&apos;énergie que ça n&apos;en a l&apos;air.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {[
              "Je devrais publier quelque chose cette semaine.",
              "Mais sur quoi ? Je ne vois pas d'angle",
              "Bon, je verrai ça demain.",
              "Je n'ai rien publié. Encore.",
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

          <div className="mt-10 text-center">
            <p className="mx-auto mt-4 max-w-xl text-[#666]">
            Ce n&apos;est pas que tu n&apos;as rien à dire. C&apos;est qu&apos;il n&apos;y a personne pour te poser la bonne question au bon moment.
            </p>
            <span className="text-sm font-semibold uppercase tracking-wide text-[#6c63ff]">
            Echo fait exactement ça.
            </span>
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
            En moins de 10 minutes, de zéro à prêt à publier. En moins de 10 minutes par post, tu récupères en moyenne 7h chaque mois.
            </p>
          </div>

          {/* Ciblage par segment */}
          <div className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-medium md:text-4xl">
                Fait pour toi, si tu construis quelque chose.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "Freelance & consultant",
                  text: "Tu vends ton expertise. LinkedIn est ton canal numéro un. Mais entre les missions, la veille et l'admin, les posts passent à la trappe.",
                  cta: "Je teste pour mon activité →",
                },
                {
                  title: "Dirigeant de TPE / PME",
                  text: "Tu as des choses à dire sur ton secteur. Mais tu n'as pas le temps d'écrire, et tu ne veux pas que ça sonne creux.",
                  cta: "Je teste pour mon entreprise →",
                },
                {
                  title: "Solopreneur / créateur",
                  text: "Tu construis en public. Tu sais que la régularité compte. Mais trouver quoi dire chaque semaine, c'est le truc qui coince.",
                  cta: "Je teste pour mon projet →",
                },
              ].map((segment, i) => (
                <Reveal key={segment.title} delay={i * 120}>
                  <div className="flex h-full flex-col rounded-2xl border-[0.5px] border-[#e5e5e5] bg-[#f8f8f8] p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                    <h3 className="text-lg font-semibold">{segment.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#666]">
                      {segment.text}
                    </p>
                    <Button asChild className="mt-6">
                      <Link href="/sign-up">{segment.cta}</Link>
                    </Button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Tu laisses Echo trouver le point de départ",
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

          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link href="/sign-up">Générer mes 9 premières idées →</Link>
            </Button>
          </div>

          {/* Preuve visuelle */}
          <div className="mt-24">
            <div className="text-center">
              <h2 className="text-3xl font-medium md:text-4xl">
                Voici ce que ça donne.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[#666]">
                Des posts réels, générés par Echo, publiés tels quels.
              </p>
            </div>

            <div className="mt-12 flex flex-col items-stretch justify-center gap-6 lg:flex-row">
              {[
                {
                  initials: "MD",
                  name: "Marie D.",
                  role: "Consultante RH indépendante",
                  reactions: 47,
                  comments: "12 commentaires",
                  content: `J'ai mis 3 ans à comprendre pourquoi mes recrutements échouaient.

Ce n'était pas le profil. Ce n'était pas le salaire.

C'était le brief.

Quand le manager ne sait pas vraiment ce qu'il cherche, personne ne peut recruter correctement.

Aujourd'hui, avant chaque mission, je passe 1h à recadrer le besoin. Résultat : 80% de mes placements tiennent au-delà de 6 mois.

Le recrutement commence avant le premier CV.`,
                },
                {
                  initials: "TM",
                  name: "Thomas M.",
                  role: "Dirigeant TPE",
                  reactions: 47,
                  comments: "12 commentaires",
                  content: `On a failli refuser notre plus gros contrat de l'année.

Le client voulait un délai de 10 jours. On était à 3 semaines minimum.

Au lieu de dire non, on a proposé une livraison partielle à J+10 avec la suite à J+21.

Il a dit oui. Et il nous a recommandé deux fois depuis.

Le non réflexe est souvent une erreur. La vraie question : qu'est-ce qu'on peut faire ?`,
                },
                {
                  initials: "LR",
                  name: "Lucie R.",
                  role: "Freelance marketing",
                  reactions: 47,
                  comments: "12 commentaires",
                  content: `Personne ne m'a appris à facturer. J'ai appris à mes dépens.

Première année : taux horaire trop bas, clients qui négocient, retards de paiement.

Ce que j'ai changé :
→ Forfaits uniquement, plus de taux horaire
→ Acompte 50% à la commande
→ Relance automatique à J+3

Résultat : zéro impayé depuis 14 mois. Et des clients qui respectent le cadre parce que moi je le pose.`,
                },
              ].map((post, i) => (
                <Reveal key={post.name} delay={i * 120}>
                  <LinkedInPostMockup {...post} />
                </Reveal>
              ))}
            </div>
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
                  "Tu hésites avant de publier parce que ça ne te ressemble pas vraiment.",
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
            <Button asChild size="lg">
              <Link href="/sign-up">Générer mes 4 premiers posts →</Link>
            </Button>
            <p className="mt-3 text-sm text-[#666]">
              Gratuit · Sans carte bancaire · 4 posts inclus pour tester
            </p>
          </div>
        </div>
      </section>

      {/* 7. Section FAQ */}
      <section className="bg-[#f8f8f8] px-6 py-20">
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

          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link href="/sign-up">
                Prêt à ne plus chercher quoi publier ? → Essayer gratuitement
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Ancrage valeur avant tarifs */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="mx-auto max-w-2xl text-lg font-medium text-[#111]">
              7h / mois. C&apos;est ce que récupèrent en moyenne les utilisateurs
              Echo en arrêtant de chercher quoi écrire.
            </p>
          </div>

          <div className="mt-12 rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm md:p-8">
            <h3 className="text-center text-2xl font-medium md:text-3xl">
              19€/mois. Soit moins qu&apos;une heure de ghostwriting.
            </h3>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Ghostwriter freelance",
                  price: "300–500€ / post",
                  label: "Pour un seul post, sans mémoire de votre style",
                },
                {
                  title: "Agence de communication",
                  price: "800–2 000€ / mois",
                  label: "Avec délais, briefs, allers-retours",
                },
                {
                  title: "Echo ✦",
                  price: "19€ / mois",
                  label: "Posts illimités, dans ton style, en 10 minutes",
                  featured: true,
                },
              ].map((option) => (
                <div
                  key={option.title}
                  className={`rounded-xl border p-5 ${
                    option.featured
                      ? "border-primary/30 bg-primary/10"
                      : "border-[#e5e5e5] bg-[#f8f8f8]"
                  }`}
                >
                  <div className="text-sm font-semibold text-[#111]">
                    {option.title}
                  </div>
                  <div className="mt-3 text-2xl font-medium text-[#111]">
                    {option.price}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#666]">
                    {option.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Section Tarifs */}
      <PricingSection />

      {/* 10. Section Témoignages */}
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
                published: "Post publié il y a 3 jours",
                avatarColor: "bg-indigo-100 text-indigo-700",
                quote:
                  "Le vrai déclic, c'est la mémoire. Echo reprend mes angles et me pousse à ajouter du concret quand je suis trop vague.",
              },
              {
                initials: "MK",
                name: "Marc K.",
                role: "Dirigeant PME, secteur bâtiment",
                published: "Post publié il y a 5 jours",
                avatarColor: "bg-emerald-100 text-emerald-700",
                quote:
                  "Le score dwell time et le garde-fou thématique m'aident à améliorer mes posts avant de publier.",
              },
              {
                initials: "AL",
                name: "Axel L.",
                role: "Freelance marketing digital",
                published: "Post publié il y a 6 jours",
                avatarColor: "bg-amber-100 text-amber-700",
                quote:
                  "Je colle mes notes, Echo extrait la matière et me demande des précisions quand il manque une vraie expérience.",
              },
            ].map((t, i) => (
              <Reveal key={t.initials} delay={i * 120}>
                <div className="relative h-full rounded-xl border border-[#e5e5e5] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <div className="absolute left-5 top-3 text-4xl font-serif leading-none text-primary/20">
                    &quot;
                  </div>
                  <div className="text-sm font-medium text-[#6c63ff]">
                    Retour utilisateur
                  </div>
                  <p className="mt-5 italic text-[#444]">“{t.quote}”</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${t.avatarColor}`}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs italic text-[#666]">{t.role}</div>
                      <div className="text-xs text-[#999]">{t.published}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-[#e5e5e5] bg-white p-6 text-center">
            <p className="text-sm text-[#666]">
              Ces retours proviennent de nos 10 premiers bêta-testeurs. Accès
              anticipé encore disponible.
            </p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/sign-up">Rejoindre maintenant</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 11. Section CTA Final */}
      <section className="bg-[#1a1a2e] px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-medium md:text-4xl">
          La page blanche du lundi, c&apos;est pour les autres maintenant
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
