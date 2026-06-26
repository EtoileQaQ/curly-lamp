import Link from "next/link";
import { BackToTop } from "@/components/back-to-top";
import { LinkedInPostMockup } from "@/components/linkedin-post-mockup";
import { PricingSection } from "@/components/pricing-section";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

const POSTS = [
  {
    initials: "MD",
    name: "Marie D.",
    role: "Consultante RH indépendante",
    content: `J'ai mis 3 ans à comprendre pourquoi mes recrutements échouaient.

Ce n'était pas le profil. Ce n'était pas le salaire. C'était le brief.

Quand le manager ne sait pas ce qu'il cherche, personne ne peut recruter correctement.

Aujourd'hui : 80% de mes placements tiennent au-delà de 6 mois.`,
    reactions: 47,
    comments: "12 commentaires",
  },
  {
    initials: "TM",
    name: "Thomas M.",
    role: "Dirigeant TPE, bâtiment",
    content: `On a failli refuser notre plus gros contrat de l'année.

Le client voulait 10 jours. On était à 3 semaines minimum.

Au lieu de dire non : livraison partielle à J+10, le reste à J+21.

Il a dit oui. Il nous a recommandés deux fois depuis.

Le non réflexe coûte cher.`,
    reactions: 63,
    comments: "18 commentaires",
  },
  {
    initials: "LR",
    name: "Lucie R.",
    role: "Freelance marketing digital",
    content: `Personne ne m'a appris à facturer. J'ai appris à mes dépens.

An 1 : taux trop bas, négociations, retards de paiement.

Ce que j'ai changé :
→ Forfaits uniquement
→ Acompte 50% à la commande
→ Relance auto à J+3

Zéro impayé depuis 14 mois.`,
    reactions: 91,
    comments: "24 commentaires",
  },
];

const HERO_STATS = [
  { value: "10", label: "bêta-testeurs" },
  { value: "50+", label: "posts générés" },
  { value: "4,9/5", label: "note moyenne" },
  { value: "7h", label: "gagnées / mois" },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#6c63ff]">
      {children}
    </div>
  );
}

function SectionTitle({
  children,
  light = false,
  center = false,
}: {
  children: React.ReactNode;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <h2
      className={`text-2xl font-extrabold leading-tight tracking-tight md:text-4xl ${
        light ? "text-white" : "text-[#12101f]"
      } ${center ? "text-center" : ""}`}
    >
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#12101f]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#e5e2ff] bg-white px-6">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight text-[#6c63ff]">
            Echo
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#fonctionnalites"
              className="text-sm text-slate-500 transition hover:text-[#12101f]"
            >
              Fonctionnalités
            </a>
            <a
              href="#tarifs"
              className="text-sm text-slate-500 transition hover:text-[#12101f]"
            >
              Tarifs
            </a>
            <Link
              href="/sign-in"
              className="text-sm text-slate-500 transition hover:text-[#12101f]"
            >
              Se connecter
            </Link>
            <Button asChild size="sm">
              <Link href="/sign-up">Essai gratuit</Link>
            </Button>
          </div>

          <Button asChild size="sm" className="md:hidden">
            <Link href="/sign-up">Essai gratuit</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#12101f] px-6 py-20 text-center md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#6c63ff]/30 bg-[#6c63ff]/15 px-4 py-1.5 text-xs font-bold tracking-wide text-[#b8b4ff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6c63ff]" />
            Lancement en cours · Accès anticipé
          </div>

          <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white md:text-6xl">
            La page blanche du lundi,
            <br />
            <span className="text-[#6c63ff]">c&apos;est terminé.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            Echo trouve les idées, structure le message et rédige dans ton style.
            <br />
            Tu n&apos;as plus qu&apos;à publier.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/sign-up">Générer mes 4 premiers posts →</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href="#fonctionnalites">Voir comment ça marche</a>
            </Button>
          </div>

          <p className="mt-6 text-sm text-slate-600">
            ✓ 4 posts gratuits pour tester · ✓ Résultats en 10 min · ✓ Sans
            carte bancaire
          </p>

          <div className="mx-auto mt-12 grid max-w-xl grid-cols-2 gap-6 border-t border-[#2a2450] pt-8 sm:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black text-[#6c63ff]">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain mirror */}
      <section className="border-t-4 border-[#6c63ff] bg-white px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <Label>Ce que tu vis chaque semaine</Label>
          <SectionTitle>
            Tu sais que tu devrais publier.
            <br />
            <span className="text-slate-300">Mais ça ne se fait jamais.</span>
          </SectionTitle>

          <p className="mt-5 text-base leading-relaxed text-slate-500">
            Ce n&apos;est pas un manque de volonté. C&apos;est que passer de{" "}
            <em className="text-slate-400">“je devrais publier”</em> à un vrai
            post demande plus d&apos;énergie que ça n&apos;en a l&apos;air.
          </p>

          <div className="mt-9 border-l-4 border-[#e5e2ff] pl-6">
            {[
              ["→", "“Je devrais publier quelque chose cette semaine.”", "#12101f"],
              ["↓", "“Mais sur quoi ? Je ne vois pas d'angle.”", "#6b7280"],
              ["↓", "“Bon, je verrai ça demain.”", "#9ca3af"],
              ["↓", "“La semaine est passée. Je n'ai rien publié. Encore.”", "#cbd5e1"],
            ].map(([arrow, text, color]) => (
              <div
                key={text}
                className="flex items-start gap-4 border-b border-[#e5e2ff] py-3"
              >
                <span className="mt-0.5 font-mono font-bold text-[#6c63ff]">
                  {arrow}
                </span>
                <em className="text-base leading-relaxed" style={{ color }}>
                  {text}
                </em>
              </div>
            ))}
          </div>

          <div className="mt-9 rounded-xl border border-[#e5e2ff] bg-[#eee9ff] p-6">
            <p className="leading-relaxed text-indigo-800">
              Ce n&apos;est pas que tu n&apos;as rien à dire. C&apos;est qu&apos;il
              n&apos;y a personne pour te poser la bonne question au bon moment.
            </p>
            <p className="mt-2 font-bold text-[#6c63ff]">Echo fait exactement ça.</p>
          </div>

          <Button asChild className="mt-8">
            <Link href="/sign-up">Arrêter la page blanche →</Link>
          </Button>
        </div>
      </section>

      {/* Post mockups */}
      <section id="fonctionnalites" className="bg-[#f8f7ff] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <Label>Résultats réels</Label>
            <SectionTitle center>Voici ce que ça donne.</SectionTitle>
            <p className="mt-4 text-slate-500">
              Des posts générés par Echo, publiés tels quels sur LinkedIn.
            </p>
          </div>

          <div className="flex snap-x gap-5 overflow-x-auto pb-3 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {POSTS.map((post) => (
              <div key={post.name} className="min-w-[300px] snap-center">
                <LinkedInPostMockup {...post} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/sign-up">Je veux des posts comme ça →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Segments */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <Label>Pour qui</Label>
            <SectionTitle center>
              Fait pour toi, si tu construis quelque chose.
            </SectionTitle>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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
                text: "Tu construis en public. La régularité compte. Mais trouver quoi dire chaque semaine, c'est le truc qui coince.",
                cta: "Je teste pour mon projet →",
              },
            ].map((segment) => (
              <div
                key={segment.title}
                className="flex h-full flex-col rounded-xl border border-[#e5e2ff] bg-[#f8f7ff] p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-bold">{segment.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                  {segment.text}
                </p>
                <Link
                  href="/sign-up"
                  className="mt-5 text-sm font-bold text-[#6c63ff] hover:underline"
                >
                  {segment.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#f8f7ff] px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 text-center">
            <Label>Comment ça marche</Label>
            <SectionTitle center>
              De zéro idée à post publié.
              <br />
              En moins de 10 minutes.
            </SectionTitle>
            <p className="mt-4 text-slate-500">
              En moyenne, les utilisateurs récupèrent{" "}
              <strong>7h par mois</strong> en arrêtant de chercher seuls.
            </p>
          </div>

          {[
            {
              number: "01",
              title: "Tu dis à Echo ce dont tu as besoin",
              text: "Pas besoin d'arriver avec un sujet. Echo génère 9 idées adaptées à ton métier en un clic. Ou tu poses une direction, même floue.",
            },
            {
              number: "02",
              title: "Echo pose les bonnes questions",
              text: "Pour éviter le post vide ou générique, il te demande une anecdote, un chiffre, une position. Ce que tu sais, mais que tu n'aurais pas pensé à mettre.",
            },
            {
              number: "03",
              title: "Tu publies avec confiance",
              text: "Tu récupères un post structuré, fidèle à ton style, prêt à ajuster. Tu copies, tu publies quand tu veux.",
              cta: "Commencer en 2 minutes →",
            },
          ].map((step) => (
            <div key={step.number} className="mb-10 flex gap-7">
              <div className="w-10 shrink-0 text-right text-3xl font-black leading-none text-[#6c63ff]/25">
                {step.number}
              </div>
              <div className="flex-1 border-l-2 border-[#e5e2ff] pl-6">
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {step.text}
                </p>
                {step.cta && (
                  <Button asChild className="mt-4">
                    <Link href="/sign-up">{step.cta}</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sans / Avec */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <Label>La différence en pratique</Label>
            <SectionTitle center>
              Ce qui change quand tu arrêtes de chercher seul.
            </SectionTitle>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                label: "Sans Echo",
                highlighted: false,
                mark: "–",
                items: [
                  "Tu bloques devant la page blanche. Tu fermes l'onglet.",
                  "Tu publies deux fois par mois, dans le meilleur des cas.",
                  "Tes posts IA sonnent propres, mais interchangeables.",
                  "Tu hésites avant de publier car ça ne te ressemble pas.",
                ],
              },
              {
                label: "Avec Echo",
                highlighted: true,
                mark: "✓",
                items: [
                  "Tu arrives sans idée. En un clic, tu en as 9. Tu choisis.",
                  "Tu publies régulièrement parce que le plus dur est déjà fait.",
                  "Echo s'appuie sur tes expériences pour éviter le générique.",
                  "Tu gardes le dernier mot avec un texte prêt à ajuster.",
                ],
              },
            ].map((column) => (
              <div
                key={column.label}
                className={`rounded-xl p-6 ${
                  column.highlighted
                    ? "border-2 border-[#6c63ff] bg-[#eee9ff]"
                    : "border border-[#e5e2ff] bg-[#f8f7ff]"
                }`}
              >
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      column.highlighted ? "bg-[#6c63ff]" : "bg-slate-300"
                    }`}
                  />
                  <span
                    className={`text-xs font-extrabold uppercase tracking-[0.12em] ${
                      column.highlighted ? "text-[#6c63ff]" : "text-slate-400"
                    }`}
                  >
                    {column.label}
                  </span>
                </div>

                {column.items.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 border-b border-[#e5e2ff] py-3 last:border-b-0"
                  >
                    <span
                      className={
                        column.highlighted ? "text-[#6c63ff]" : "text-slate-300"
                      }
                    >
                      {column.mark}
                    </span>
                    <span
                      className={`text-sm leading-relaxed ${
                        column.highlighted ? "text-[#12101f]" : "text-slate-500"
                      }`}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/sign-up">Générer mes 4 premiers posts →</Link>
            </Button>
            <p className="mt-3 text-sm text-slate-500">
              Gratuit · Sans carte bancaire · 4 posts inclus
            </p>
          </div>
        </div>
      </section>

      {/* Price anchor */}
      <section className="bg-[#f8f7ff] px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <Label>Comparaison</Label>
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            19€/mois. Soit moins qu&apos;une heure de ghostwriting.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Ghostwriter freelance",
                price: "300–500€",
                unit: "par post",
                note: "Sans mémoire de votre style",
              },
              {
                title: "Agence de com'",
                price: "800–2000€",
                unit: "/ mois",
                note: "Avec délais & allers-retours",
              },
              {
                title: "Echo ✦",
                price: "19€",
                unit: "/ mois",
                note: "Posts illimités, dans ton style",
                highlighted: true,
              },
            ].map((option) => (
              <div
                key={option.title}
                className={`rounded-xl p-5 ${
                  option.highlighted
                    ? "border-2 border-[#6c63ff] bg-[#eee9ff]"
                    : "border border-[#e5e2ff] bg-white"
                }`}
              >
                <div
                  className={`text-xs font-extrabold uppercase tracking-[0.1em] ${
                    option.highlighted ? "text-[#6c63ff]" : "text-slate-500"
                  }`}
                >
                  {option.title}
                </div>
                <div
                  className={`mt-2 text-3xl font-black ${
                    option.highlighted ? "text-[#6c63ff]" : "text-[#12101f]"
                  }`}
                >
                  {option.price}
                </div>
                <div className="text-xs text-slate-500">{option.unit}</div>
                <div className="mt-2 text-xs leading-relaxed text-slate-500">
                  {option.note}
                </div>
              </div>
            ))}
          </div>

          <Button asChild className="mt-8">
            <Link href="/sign-up">Essayer à 0€ →</Link>
          </Button>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <Label>Ils l&apos;utilisent déjà</Label>
            <SectionTitle center>Ce qu&apos;ils en disent.</SectionTitle>
            <p className="mt-4 text-sm text-slate-500">
              Retours de nos 10 premiers bêta-testeurs · Accès anticipé encore
              disponible
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                quote:
                  "Le vrai déclic, c'est la mémoire. Echo reprend mes angles et me pousse à ajouter du concret quand je suis trop vague.",
                name: "Sophie L.",
                role: "Consultante RH indépendante",
                color: "bg-indigo-500",
              },
              {
                quote:
                  "Le score dwell time et le garde-fou thématique m'aident à améliorer mes posts avant de publier.",
                name: "Marc K.",
                role: "Dirigeant PME, bâtiment",
                color: "bg-blue-600",
              },
              {
                quote:
                  "Je colle mes notes, Echo extrait la matière et me demande des précisions quand il manque une vraie expérience.",
                name: "Axel L.",
                role: "Freelance marketing digital",
                color: "bg-violet-600",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-xl border border-[#e5e2ff] bg-[#f8f7ff] p-6"
              >
                <div className="mb-4 text-5xl font-black leading-none text-[#6c63ff]/20">
                  &quot;
                </div>
                <p className="text-sm italic leading-relaxed text-slate-700">
                  “{testimonial.quote}”
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${testimonial.color}`}
                  >
                    {testimonial.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.role}</div>
                    <div className="text-xs text-[#c4c0f0]">il y a 2 jours</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/sign-up">Rejoindre les premiers utilisateurs →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing: kept functional with Stripe checkout */}
      <PricingSection />

      {/* FAQ */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <Label>FAQ</Label>
            <SectionTitle center>Les questions que tu te poses.</SectionTitle>
          </div>

          <div className="divide-y divide-[#e5e2ff]">
            {[
              {
                q: "Je n'ai vraiment aucune idée de quoi publier. Echo peut m'aider ?",
                a: "C'est exactement le cas d'usage principal. Echo commence par te proposer 9 idées adaptées à ton métier, ta cible et tes sujets passés. Tu n'as pas à arriver avec quoi que ce soit.",
              },
              {
                q: "Est-ce que mes posts vont sonner comme de l'IA ?",
                a: "Echo réduit ce risque en s'appuyant sur ta mémoire éditoriale : anecdotes, positions, style et anciens posts. Quand la matière manque, il te pose des questions avant de générer.",
              },
              {
                q: "C'est quoi la différence avec ChatGPT ?",
                a: "Echo retient ton style et tes sujets déjà traités. Il détecte quand une idée est trop vague, te pose des questions pour éviter le générique, et mesure le dwell time avant publication.",
              },
              {
                q: "Combien de temps ça prend vraiment ?",
                a: "L'onboarding prend quelques minutes. Ensuite, un post prend moins de 10 minutes. En moyenne, les utilisateurs récupèrent 7h par mois.",
              },
              {
                q: "Est-ce que ça publie directement sur LinkedIn ?",
                a: "Non, tu gardes le contrôle total. Echo prépare le texte et le visuel : tu copies, tu publies quand tu veux.",
              },
              {
                q: "Je peux annuler quand je veux ?",
                a: "Oui, depuis le portail Stripe accessible dans l'application. Aucune démarche complexe.",
              },
            ].map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center gap-4 text-left font-semibold [&::-webkit-details-marker]:hidden">
                  <span className="flex-1">{faq.q}</span>
                  <span className="text-2xl leading-none text-[#6c63ff] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-[#e5e2ff] bg-[#f8f7ff] p-7 text-center">
            <p className="mb-4 text-slate-500">
              Encore un doute ? Le plus simple, c&apos;est d&apos;essayer.
            </p>
            <Button asChild>
              <Link href="/sign-up">Générer mes 4 posts gratuits →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#6c63ff] px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
            La page blanche du lundi,
            <br />
            <span className="opacity-70">c&apos;est pour les autres.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            4 posts gratuits pour tester. Sans carte bancaire.
            <br />
            Résultats en moins de 10 minutes.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-9 bg-white text-[#6c63ff] hover:bg-white/90"
          >
            <Link href="/sign-up">Générer mes 4 premiers posts →</Link>
          </Button>
          <p className="mt-4 text-sm text-white/45">
            Garantie 30 jours · Annulation en 1 clic
          </p>
        </div>
      </section>

      <SiteFooter />
      <BackToTop />
    </div>
  );
}
