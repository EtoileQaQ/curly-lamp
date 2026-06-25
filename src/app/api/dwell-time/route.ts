import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import {
  anthropic,
  CLAUDE_MODEL,
  extractText,
  safeParseJson,
} from "@/lib/anthropic";
import { SYSTEM_PROMPT_DWELL_TIME } from "@/lib/prompts";
import { checkAiRateLimit } from "@/lib/ratelimit";

type ScoreResult = {
  score: number;
  label: "Faible" | "Correct" | "Excellent";
  suggestions: string[];
};

const DwellSchema = z.object({
  content: z.string().min(1).max(10000),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { success } = await checkAiRateLimit(userId);
  if (!success) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessaie dans une minute." },
      { status: 429 }
    );
  }

  const parsedInput = DwellSchema.safeParse(
    await request.json().catch(() => null)
  );
  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "Contenu à analyser invalide ou trop long." },
      { status: 400 }
    );
  }
  const { content } = parsedInput.data;

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 700,
      system: SYSTEM_PROMPT_DWELL_TIME,
      messages: [
        {
          role: "user",
          content: `Analyse le post fourni selon ces critères :
- Longueur : un post > 1200 caractères favorise le dwell time (+2 pts)
- Questions intercalées : présence de questions dans le corps du texte (+1 pt)
- Structure aérée : sauts de ligne réguliers, pas de blocs denses (+1 pt)
- Accroche forte : la première ligne donne envie de cliquer "voir plus" (+2 pts)
- Conclusion avec invitation à réagir : pas juste des hashtags (+1 pt)
- Authenticité : présence d'un point de vue personnel ou d'une anecdote (+2 pts)
- Hashtags : 3 maximum, pertinents (+1 pt)

Réponds uniquement au format exact :
{"score": number (1 à 10), "label": "Faible" | "Correct" | "Excellent", "suggestions": [2 à 3 suggestions courtes et concrètes]}

Règle pour le label : score <= 3 => "Faible", 4 à 6 => "Correct", >= 7 => "Excellent".

Post à analyser :
"""
${content}
"""`,
        },
      ],
    });

    const parsed = safeParseJson<ScoreResult>(extractText(message.content));
    if (!parsed || typeof parsed.score !== "number") {
      return NextResponse.json(
        { error: "Réponse inattendue de l'IA." },
        { status: 502 }
      );
    }

    // On borne le score entre 1 et 10 par sécurité.
    parsed.score = Math.max(1, Math.min(10, Math.round(parsed.score)));
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[/api/dwell-time]", err);
    return NextResponse.json(
      { error: "Le service d'analyse est momentanément indisponible." },
      { status: 500 }
    );
  }
}
