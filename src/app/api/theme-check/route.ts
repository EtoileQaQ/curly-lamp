import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  anthropic,
  CLAUDE_MODEL,
  extractText,
  safeParseJson,
} from "@/lib/anthropic";
import { SYSTEM_PROMPT_REDUNDANCY } from "@/lib/prompts";
import { checkAiRateLimit } from "@/lib/ratelimit";

const ThemeSchema = z.object({
  idea: z.string().min(1).max(300),
});

type ThemeCheck = {
  alerte: boolean;
  niveau: "aucun" | "attention" | "repetition";
  message: string;
  posts_similaires: string[];
  angle_alternatif: string;
};

const NONE: ThemeCheck = {
  alerte: false,
  niveau: "aucun",
  message: "",
  posts_similaires: [],
  angle_alternatif: "",
};

// Le garde-fou ne s'active qu'à partir de 5 posts générés.
const MIN_POSTS = 5;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Garde-fou non bloquant : si le quota est dépassé, on n'alerte simplement pas.
  const { success } = await checkAiRateLimit(userId);
  if (!success) {
    return NextResponse.json(NONE);
  }

  const parsedInput = ThemeSchema.safeParse(
    await request.json().catch(() => null)
  );
  if (!parsedInput.success) {
    return NextResponse.json(NONE);
  }
  const { idea } = parsedInput.data;

  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("title, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  // Pas assez de données pour conseiller utilement.
  if (!posts || posts.length < MIN_POSTS) {
    return NextResponse.json(NONE);
  }

  const list = posts
    .map(
      (p, i) =>
        `${i + 1}. ${p.title ?? "Sans titre"} — ${(p.content ?? "").slice(0, 150)}`
    )
    .join("\n");

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 600,
      system: SYSTEM_PROMPT_REDUNDANCY,
      messages: [
        {
          role: "user",
          content: `Voici le sujet que l'utilisateur veut traiter aujourd'hui :
${idea}

Voici ses 20 derniers posts LinkedIn générés (du plus récent au plus ancien) :
${list}

Analyse si ce sujet a déjà été traité de façon trop proche ou trop récurrente.

Réponds uniquement avec un JSON valide (guillemets doubles), sans texte autour :
{"alerte": boolean, "niveau": "aucun" | "attention" | "repetition", "message": "explication courte et bienveillante, max 1 phrase", "posts_similaires": ["titres des 1 à 3 posts trop proches, si applicable"], "angle_alternatif": "suggestion d'un angle différent pour traiter quand même ce sujet de façon fraîche"}

Règles : "attention" si un sujet proche a été abordé récemment ; "repetition" si le sujet revient souvent ; "aucun" sinon (et dans ce cas, posts_similaires vide).`,
        },
      ],
    });

    const parsed = safeParseJson<ThemeCheck>(extractText(message.content));
    if (!parsed || !parsed.niveau) {
      return NextResponse.json(NONE);
    }
    return NextResponse.json(parsed);
  } catch {
    // En cas d'erreur IA, on ne bloque jamais : aucune alerte.
    return NextResponse.json(NONE);
  }
}
