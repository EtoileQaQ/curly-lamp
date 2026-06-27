import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import {
  anthropic,
  CLAUDE_MODEL,
  extractText,
  safeParseJson,
} from "@/lib/anthropic";
import { SYSTEM_PROMPT_REPURPOSING } from "@/lib/prompts";
import { checkAiRateLimit, checkAuxAiLimit } from "@/lib/ratelimit";
import { isApiDisabled } from "@/lib/flags";
import { logAiUsage } from "@/lib/usage";

const AnalyzeSchema = z.object({
  source: z.string().min(10).max(20000),
});

type Analysis = {
  type:
    | "lien_article"
    | "transcript"
    | "notes"
    | "idee_brute"
    | "texte_long";
  resume_en_3_points: string[];
  angle_suggere: string;
};

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Kill-switch d'urgence : coupe tout appel IA si activé.
  if (await isApiDisabled()) {
    return NextResponse.json(
      { error: "Le service d'analyse est momentanément désactivé." },
      { status: 503 }
    );
  }

  const { success } = await checkAiRateLimit(userId);
  if (!success) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessaie dans une minute." },
      { status: 429 }
    );
  }

  // Plafond quotidien des appels IA auxiliaires (anti-abus).
  const auxLimit = await checkAuxAiLimit(userId);
  if (!auxLimit.success) {
    return NextResponse.json(
      { error: "Limite quotidienne d'analyses atteinte. Réessaie demain." },
      { status: 429 }
    );
  }

  const parsedInput = AnalyzeSchema.safeParse(
    await request.json().catch(() => null)
  );
  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "Colle un contenu plus consistant (et pas trop long) à analyser." },
      { status: 400 }
    );
  }
  const { source } = parsedInput.data;

  try {
    const message = await anthropic.messages.create(
      {
        model: CLAUDE_MODEL,
        max_tokens: 700,
        system: SYSTEM_PROMPT_REPURPOSING,
        messages: [
          {
            role: "user",
            content: `Analyse ce contenu brut. Il peut s'agir d'un lien, d'un article, de notes, d'une idée brute ou d'un transcript.

Réponds uniquement avec un JSON valide (guillemets doubles), sans texte autour :
{"type": "lien_article" | "transcript" | "notes" | "idee_brute" | "texte_long", "resume_en_3_points": ["3 idées clés extraites du contenu"], "angle_suggere": "l'angle LinkedIn le plus pertinent pour ce contenu"}

Contenu à analyser :
"""
${source.slice(0, 8000)}
"""`,
          },
        ],
      },
      { signal: request.signal }
    );

    await logAiUsage({
      userId,
      route: "repurpose-analyze",
      model: CLAUDE_MODEL,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    });

    const parsed = safeParseJson<Analysis>(extractText(message.content));
    if (!parsed || !Array.isArray(parsed.resume_en_3_points)) {
      return NextResponse.json(
        { error: "Analyse impossible. Réessaie avec un contenu plus clair." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[/api/repurpose/analyze]", err);
    return NextResponse.json(
      { error: "Le service d'analyse est momentanément indisponible." },
      { status: 500 }
    );
  }
}
