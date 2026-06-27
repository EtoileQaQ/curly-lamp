import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  anthropic,
  CLAUDE_MODEL,
  extractText,
  safeParseJson,
} from "@/lib/anthropic";
import { SYSTEM_PROMPT_IDEA_GENERATION } from "@/lib/prompts";
import { checkAiRateLimit, checkIdeaGenerationLimit } from "@/lib/ratelimit";
import { isApiDisabled } from "@/lib/flags";
import { logAiUsage } from "@/lib/usage";

type IdeaAngle =
  | "retour_experience"
  | "prise_de_position"
  | "conseil"
  | "histoire"
  | "observation";

type GeneratedIdea = {
  title: string;
  angle: IdeaAngle;
  memory_anchor: string;
  zone: string;
};

function formatList(items: string[]) {
  return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "- Aucun";
}

function excerpt(value: string | null | undefined, max = 220) {
  const text = value?.replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function isGeneratedIdea(value: unknown): value is GeneratedIdea {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<GeneratedIdea>;
  return (
    typeof item.title === "string" &&
    typeof item.angle === "string" &&
    typeof item.memory_anchor === "string" &&
    typeof item.zone === "string"
  );
}

function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function removeObviousDuplicates(ideas: GeneratedIdea[]) {
  const seenTitles = new Set<string>();
  const anchorCounts = new Map<string, number>();
  const zoneCounts = new Map<string, number>();
  const kept: GeneratedIdea[] = [];

  for (const idea of ideas) {
    const titleKey = normalizeKey(idea.title);
    const anchorKey = normalizeKey(idea.memory_anchor);
    const zoneKey = normalizeKey(idea.zone);
    const anchorCount = anchorCounts.get(anchorKey) ?? 0;
    const zoneCount = zoneCounts.get(zoneKey) ?? 0;

    if (seenTitles.has(titleKey)) continue;
    if (anchorKey && anchorCount >= 1) continue;
    if (zoneKey && zoneCount >= 1) continue;

    seenTitles.add(titleKey);
    if (anchorKey) anchorCounts.set(anchorKey, anchorCount + 1);
    if (zoneKey) zoneCounts.set(zoneKey, zoneCount + 1);
    kept.push(idea);
  }

  for (const idea of ideas) {
    if (kept.length >= 9) break;
    const titleKey = normalizeKey(idea.title);
    if (seenTitles.has(titleKey)) continue;
    seenTitles.add(titleKey);
    kept.push(idea);
  }

  return kept;
}

function formatMemoryByCategory(
  rows: { content: string; category: string }[] | null,
  category: string
) {
  const items =
    rows
      ?.filter((row) => row.category === category && row.content?.trim())
      .map((row) => row.content.trim()) ?? [];

  return formatList(items);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Kill-switch d'urgence : coupe toute génération IA si activé.
  if (await isApiDisabled()) {
    return NextResponse.json(
      { error: "La génération est momentanément désactivée. Réessaie plus tard." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const priorityZone = typeof body?.zone === "string" ? body.zone.trim() : "";

  const { success } = await checkAiRateLimit(userId);
  if (!success) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessaie dans une minute." },
      { status: 429 }
    );
  }

  const ideaLimit = await checkIdeaGenerationLimit(userId);
  if (!ideaLimit.success) {
    return NextResponse.json(
      {
        error:
          "Tu as atteint la limite quotidienne de générations d'idées. Réessaie demain.",
        reset: ideaLimit.reset,
      },
      { status: 429 }
    );
  }

  // 1) On récupère le profil de l'utilisateur.
  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("job, audience, goal")
    .eq("user_id", userId)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json(
      { error: "Profil introuvable. Complète d'abord ton onboarding." },
      { status: 400 }
    );
  }

  const [
    { data: memoryRows, error: memoryError },
    { data: recentPosts, error: postsError },
    { data: unexploredRows, error: unexploredError },
  ] = await Promise.all([
    supabase
      .from("identity_memory")
      .select("content, category")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("posts")
      .select("title, content, theme_tag")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .or("title.not.is.null,theme_tag.not.is.null")
      .limit(priorityZone ? 12 : 25),
    supabase
      .from("theme_analysis")
      .select("zone_name")
      .eq("user_id", userId)
      .eq("status", "unexplored"),
  ]);

  if (memoryError) console.error("[/api/ideas] mémoire", memoryError);
  if (postsError) console.error("[/api/ideas] posts", postsError);
  if (unexploredError) {
    console.error("[/api/ideas] zones à explorer", unexploredError);
  }

  const identityMemory =
    memoryRows && memoryRows.length > 0
      ? memoryRows
          .map((row) => `- ${row.category} : ${row.content}`)
          .join("\n")
      : "- Aucune mémoire identitaire disponible.";

  const expertiseTerritories = [
    `Métier / secteur : ${profile.job}`,
    `Audience : ${profile.audience}`,
    `Objectif : ${profile.goal}`,
    "Expertises déclarées :",
    formatMemoryByCategory(memoryRows ?? [], "expertise"),
    "Positions fortes :",
    formatMemoryByCategory(memoryRows ?? [], "position"),
    "Retours d'expérience disponibles :",
    formatMemoryByCategory(memoryRows ?? [], "retour_experience"),
  ].join("\n");

  const usefulRecentPosts = (recentPosts ?? []).filter(
    (post) => post.title?.trim() || post.theme_tag?.trim()
  );

  const last20PostsTitles = usefulRecentPosts
    .map((post) => post.title)
    .filter((title): title is string => Boolean(title?.trim()));

  const last20PostsContext = usefulRecentPosts
    .map((post, index) => {
      const title = post.title?.trim() || "Sans titre";
      const content = priorityZone ? "" : excerpt(post.content);
      const theme = post.theme_tag ? ` | thème: ${post.theme_tag}` : "";
      return `${index + 1}. ${title}${theme}${content ? `\nExtrait : ${content}` : ""}`;
    })
    .filter(Boolean);

  const themeCounts = new Map<string, number>();
  for (const post of usefulRecentPosts) {
    if (!post.theme_tag) continue;
    themeCounts.set(post.theme_tag, (themeCounts.get(post.theme_tag) ?? 0) + 1);
  }

  const overusedThemes = Array.from(themeCounts.entries())
    .filter(([, count]) => count > 3)
    .map(([theme, count]) => `${theme} (${count} posts)`);

  const underexploredZones = (unexploredRows ?? [])
    .map((row) => row.zone_name)
    .filter((zone): zone is string => Boolean(zone?.trim()));

  const historyConstraint =
    usefulRecentPosts.length >= 5
      ? "Applique strictement la contrainte d'historique."
      : "L'utilisateur a moins de 5 posts générés : ignore la contrainte d'historique et maximise la variété.";

  const fullSystem = `${SYSTEM_PROMPT_IDEA_GENERATION}

Tu dois générer 9 idées de posts LinkedIn DIFFÉRENTES à chaque appel.

Pour garantir cette variété, tu disposes de :

MÉMOIRE IDENTITAIRE :
${identityMemory}

TERRITOIRES D'EXPERTISE À EXPLORER EN PRIORITÉ :
${expertiseTerritories}

POSTS DÉJÀ GÉNÉRÉS (ne pas répéter ces angles, même reformulés) :
${formatList(last20PostsTitles)}

EXTRAITS DES POSTS DÉJÀ GÉNÉRÉS (ne pas reprendre ces anecdotes, exemples, situations, raisonnements ou thèmes récurrents) :
${formatList(last20PostsContext)}

ZONES DÉJÀ SUREXPLOITÉES (à éviter) :
${formatList(overusedThemes)}

ZONES À EXPLORER (à privilégier) :
${formatList(underexploredZones)}

${priorityZone ? `ZONE PRIORITAIRE : génère 7 idées sur 9 centrées spécifiquement sur "${priorityZone}". Les 2 autres idées peuvent ouvrir vers des angles complémentaires, mais doivent rester cohérentes avec cette zone.` : ""}

RÈGLES DE GÉNÉRATION :
- Minimum 5 idées doivent explorer les territoires d'expertise, positions ou retours d'expérience de l'utilisateur.
- Maximum 2 idées peuvent être centrées sur des anecdotes personnelles.
- Minimum 3 idées issues des zones à explorer si des zones existent.
- Aucune idée ne peut reprendre l'angle exact d'un post déjà généré.
- Aucune idée ne peut reprendre une anecdote, situation, exemple ou raisonnement déjà utilisé dans les extraits des posts existants.
- Chaque idée doit être ancrée dans au moins un élément de la mémoire identitaire.
- Varier les formats suggérés : retour d'expérience, prise de position, conseil concret, histoire personnelle, observation.
- Sur les 9 idées, tu dois utiliser au moins 6 memory_anchor différents si la mémoire le permet.
- Tu dois utiliser au moins 7 zones différentes sur les 9 idées.
- La valeur "zone" doit être un territoire précis lié à l'expertise de l'utilisateur, pas un thème générique type "Leadership" ou "Business".
- Tu n'as pas le droit de proposer plus de 1 idée sur la même idée générale, le même thème ou la même tension narrative.
- Tu n'as pas le droit de proposer plus de 1 idée fondée sur la même anecdote précise.
- Si une anecdote de la mémoire ressemble à un post déjà généré, considère-la comme déjà utilisée et choisis une autre matière.
- Avant de répondre, compare les 9 idées entre elles et remplace toute idée trop proche d'une autre.
- Si tu hésites entre une idée d'anecdote et une idée d'expertise, choisis l'idée d'expertise.
- ${historyConstraint}

Réponds UNIQUEMENT en JSON :
{
  "ideas": [
    {
      "title": string,
      "angle": "retour_experience" | "prise_de_position" | "conseil" | "histoire" | "observation",
      "memory_anchor": string,
      "zone": string
    }
  ]
}`;

  const userPrompt = `Profil de l'utilisateur :
- Métier / secteur : ${profile.job}
- Cible LinkedIn : ${profile.audience}
- Objectif LinkedIn : ${profile.goal}

Génère exactement 9 idées de posts LinkedIn structurées.

Contraintes :
${priorityZone ? `- Zone prioritaire demandée par l'utilisateur : ${priorityZone}.` : ""}
- Chaque titre est court (max ~12 mots), percutant, en français, et adapté à la cible.
- Pas de numérotation, pas de hashtags, pas d'emojis dans les titres.
- Les idées doivent être ancrées dans la matière fournie par l'utilisateur, pas génériques.
- Les champs "memory_anchor" et "zone" doivent être utiles pour expliquer pourquoi l'idée est pertinente.
- Le champ "zone" doit décrire une facette précise de l'expertise ou de la position de l'utilisateur.
- Les 9 titres doivent pouvoir être publiés sur 9 jours différents sans donner l'impression de parler du même sujet.`;

  // 3) Appel à Claude.
  try {
    const message = await anthropic.messages.create(
      {
        model: CLAUDE_MODEL,
        max_tokens: 2000,
        temperature: 0.9,
        system: fullSystem,
        messages: [{ role: "user", content: userPrompt }],
      },
      { signal: request.signal }
    );

    await logAiUsage({
      userId,
      route: "ideas",
      model: CLAUDE_MODEL,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    });

    const text = extractText(message.content);
    const parsed = safeParseJson<{ ideas: unknown[] }>(text);

    if (!parsed?.ideas?.length) {
      return NextResponse.json(
        { error: "Réponse inattendue de l'IA. Réessaie." },
        { status: 502 }
      );
    }

    const ideas = removeObviousDuplicates(parsed.ideas.filter(isGeneratedIdea)).slice(
      0,
      9
    );
    if (ideas.length === 0) {
      return NextResponse.json(
        { error: "Réponse inattendue de l'IA. Réessaie." },
        { status: 502 }
      );
    }

    // On garde 9 idées maximum, par sécurité.
    return NextResponse.json({
      ideas,
      remainingIdeaGenerations: ideaLimit.remaining,
    });
  } catch (err) {
    console.error("[/api/ideas]", err);
    return NextResponse.json(
      { error: "Le service de génération est momentanément indisponible." },
      { status: 500 }
    );
  }
}
