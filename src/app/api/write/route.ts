import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { anthropic, CLAUDE_MODEL, extractText } from "@/lib/anthropic";
import { getIdentityMemoryBlock } from "@/lib/identity";
import { hasReachedFreeLimit } from "@/lib/plan";
import { SYSTEM_PROMPT_WRITE_STRUCTURED } from "@/lib/prompts";
import { checkAiRateLimit, checkDailyGenerationLimit } from "@/lib/ratelimit";
import { isApiDisabled } from "@/lib/flags";
import { logAiUsage } from "@/lib/usage";

const WriteSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("generate"),
    idea: z.string().min(1).max(300),
    instruction: z.string().max(500).optional(),
  }),
  z.object({
    mode: z.literal("generate_from_clarification"),
    originalIdea: z.string().min(1).max(300),
    clarificationExchange: z.string().min(1).max(5000),
    instruction: z.string().max(500).optional(),
  }),
]);

type WriteResponse =
  | { mode: "post"; content: string }
  | { mode: "clarifying"; questions: string };

function isWriteResponse(value: unknown): value is WriteResponse {
  if (!value || typeof value !== "object") return false;
  const payload = value as Partial<WriteResponse>;
  if (payload.mode === "post") return typeof payload.content === "string";
  if (payload.mode === "clarifying") {
    return typeof payload.questions === "string";
  }
  return false;
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

  const { success } = await checkAiRateLimit(userId);
  if (!success) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessaie dans une minute." },
      { status: 429 }
    );
  }

  // Plafond quotidien anti-abus (s'applique aussi aux comptes Pro "illimités").
  const daily = await checkDailyGenerationLimit(userId);
  if (!daily.success) {
    return NextResponse.json(
      { error: "Limite quotidienne de génération atteinte. Réessaie demain." },
      { status: 429 }
    );
  }

  // Limite du plan gratuit : 4 posts au total.
  if (await hasReachedFreeLimit(userId)) {
    return NextResponse.json({ error: "limit_reached" }, { status: 402 });
  }

  const parsedInput = WriteSchema.safeParse(
    await request.json().catch(() => null)
  );
  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "Sujet de post invalide ou trop long." },
      { status: 400 }
    );
  }
  const input = parsedInput.data;
  const idea =
    input.mode === "generate_from_clarification"
      ? input.originalIdea
      : input.idea;
  const instruction = input.instruction;

  // On récupère le profil + les anciens posts (pour imiter le style).
  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("job, audience, goal, sample_posts")
    .eq("user_id", userId)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json(
      { error: "Profil introuvable. Complète d'abord ton onboarding." },
      { status: 400 }
    );
  }

  const styleSource = profile.sample_posts ?? "";

  // La mémoire identitaire est transmise dans le message utilisateur pour garder
  // le prompt système centralisé et stable.
  const memoryBlock = await getIdentityMemoryBlock(userId);
  const identityMemory = memoryBlock || "Aucune";
  const additionalInstruction =
    instruction && typeof instruction === "string" ? instruction : "Aucune";

  const baseContext = `Voici le contexte éditorial de l'utilisateur :

STYLE D'ÉCRITURE DE L'UTILISATEUR :
"""
${styleSource}
"""

MÉMOIRE IDENTITAIRE (convictions, anecdotes, positions) :
${identityMemory}

MATIÈRE BRUTE (idée, expérience, ou contenu à repurposer) :
Sujet du post à rédiger : "${idea}"

Contexte de l'utilisateur :
- Métier / secteur : ${profile.job}
- Cible : ${profile.audience}
- Objectif : ${profile.goal}

CONSIGNE SUPPLÉMENTAIRE (si applicable) :
${additionalInstruction}`;

  const userPrompt =
    input.mode === "generate_from_clarification"
      ? `${baseContext}

Idée de départ : "${input.originalIdea}"

Tu as posé des questions de clarification et l'utilisateur a répondu.
Voici l'échange complet :
---
${input.clarificationExchange}
---

Maintenant génère le post LinkedIn en tenant compte de ces précisions.
Réponds avec le JSON { "mode": "post", "content": "..." }.`
      : `${baseContext}

Idée de départ : "${input.idea}"

Si cette idée suffit pour produire un post personnel et concret, réponds en mode "post".
Si elle est trop vague ou manque d'anecdote, réponds en mode "clarifying".`;

  try {
    const message = await anthropic.messages.create(
      {
        model: CLAUDE_MODEL,
        max_tokens: 1500,
        system: SYSTEM_PROMPT_WRITE_STRUCTURED,
        messages: [{ role: "user", content: userPrompt }],
      },
      { signal: request.signal }
    );

    await logAiUsage({
      userId,
      route: "write",
      model: CLAUDE_MODEL,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    });

    const text = extractText(message.content);

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Réponse IA invalide. Réessaie." },
        { status: 502 }
      );
    }

    if (!isWriteResponse(parsed)) {
      return NextResponse.json(
        { error: "Réponse IA incomplète. Réessaie." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[/api/write]", err);
    return NextResponse.json(
      { error: "Le service de génération est momentanément indisponible." },
      { status: 500 }
    );
  }
}
