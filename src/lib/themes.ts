// Catégorisation thématique SANS IA : on associe chaque post au thème dont
// les mots-clés apparaissent le plus dans son titre + contenu.

export type ThemeDef = { label: string; keywords: string[] };

export const THEMES: ThemeDef[] = [
  {
    label: "Leadership & management",
    keywords: [
      "leadership",
      "leader",
      "manager",
      "management",
      "equipe",
      "diriger",
      "direction",
      "collaborateur",
    ],
  },
  {
    label: "Erreurs & apprentissages",
    keywords: [
      "erreur",
      "echec",
      "rate",
      "lecon",
      "appris",
      "apprentissage",
      "rebondir",
      "essai",
    ],
  },
  {
    label: "Productivité & organisation",
    keywords: [
      "productivite",
      "organisation",
      "temps",
      "focus",
      "efficacite",
      "routine",
      "deadline",
      "priorite",
      "procrastination",
    ],
  },
  {
    label: "Carrière & recrutement",
    keywords: [
      "carriere",
      "recrutement",
      "embauche",
      "candidat",
      "entretien",
      "poste",
      "reconversion",
    ],
  },
  {
    label: "Entrepreneuriat & business",
    keywords: [
      "entrepreneur",
      "entreprise",
      "startup",
      "business",
      "client",
      "vente",
      "croissance",
      "fondateur",
      "freelance",
    ],
  },
  {
    label: "Marketing & contenu",
    keywords: [
      "marketing",
      "contenu",
      "audience",
      "branding",
      "viral",
      "newsletter",
      "strategie",
      "communaute",
    ],
  },
  {
    label: "Mindset & motivation",
    keywords: [
      "motivation",
      "mindset",
      "confiance",
      "peur",
      "ambition",
      "discipline",
      "perseverance",
      "reussite",
    ],
  },
  {
    label: "IA & tech",
    keywords: [
      "ia",
      "intelligence artificielle",
      "tech",
      "outil",
      "automatisation",
      "digital",
      "data",
      "numerique",
    ],
  },
  {
    label: "Communication & storytelling",
    keywords: [
      "communication",
      "storytelling",
      "histoire",
      "pitch",
      "message",
      "discours",
    ],
  },
  {
    label: "Bien-être & équilibre",
    keywords: [
      "bien-etre",
      "equilibre",
      "burnout",
      "stress",
      "sante",
      "repos",
      "deconnexion",
    ],
  },
];

// Minuscule + suppression des accents, pour une comparaison robuste.
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export type ThemeCount = { label: string; count: number };

export function categorizePosts(
  posts: { title: string | null; content: string | null }[]
): { explored: ThemeCount[]; unexplored: string[]; total: number } {
  const counts: Record<string, number> = {};
  for (const t of THEMES) counts[t.label] = 0;
  let other = 0;

  for (const post of posts) {
    const text = normalize(`${post.title ?? ""} ${post.content ?? ""}`);
    let best: string | null = null;
    let bestHits = 0;

    for (const theme of THEMES) {
      let hits = 0;
      for (const kw of theme.keywords) {
        if (text.includes(normalize(kw))) hits++;
      }
      if (hits > bestHits) {
        bestHits = hits;
        best = theme.label;
      }
    }

    if (best) counts[best]++;
    else other++;
  }

  const explored = THEMES.map((t) => ({ label: t.label, count: counts[t.label] }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  if (other > 0) explored.push({ label: "Autres", count: other });

  const unexplored = THEMES.filter((t) => counts[t.label] === 0).map(
    (t) => t.label
  );

  return { explored, unexplored, total: posts.length };
}
