import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { getIdentityMemoryBlock } from "@/lib/identity";
import { hasReachedFreeLimit } from "@/lib/plan";
import { SYSTEM_PROMPT_POST_GENERATION } from "@/lib/prompts";
import { checkAiRateLimit, checkDailyGenerationLimit } from "@/lib/ratelimit";
import { isApiDisabled } from "@/lib/flags";
import { logAiUsage } from "@/lib/usage";

const WriteSchema = z.object({
  idea: z.string().min(1).max(300),
  instruction: z.string().max(500).optional(),
  dialogueAnswers: z.string().max(5000).optional(),
});

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
  const { idea, instruction, dialogueAnswers } = parsedInput.data;

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

  const userPrompt = `Voici la matière pour construire ce post :

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
${additionalInstruction}

MATIÈRE ADDITIONNELLE COLLECTÉE VIA DIALOGUE :
${dialogueAnswers?.trim() || "Aucune"}

Utilise ces éléments en priorité — 
ils sont plus récents et plus spécifiques 
que la mémoire de base.

Structure ce post LinkedIn en partant uniquement 
de cette matière. Ne complète pas ce qui manque 
par des généralités — si un élément essentiel 
est absent, signale-le avant de générer.`;

  try {
    // Streaming : on renvoie le texte au fur et à mesure de sa génération,
    // pour un retour visuel immédiat côté utilisateur. Le signal de la requête
    // permet d'annuler l'appel Anthropic si le client se déconnecte (économie).
    const aiStream = await anthropic.messages.stream(
      {
        model: CLAUDE_MODEL,
        max_tokens: 1500,
        system: SYSTEM_PROMPT_POST_GENERATION,
        messages: [{ role: "user", content: userPrompt }],
      },
      { signal: request.signal }
    );

    const encoder = new TextEncoder();
    let inputTokens = 0;
    let outputTokens = 0;
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of aiStream) {
            if (event.type === "message_start") {
              inputTokens = event.message.usage.input_tokens;
            } else if (event.type === "message_delta") {
              outputTokens = event.usage.output_tokens;
            } else if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          console.error("[/api/write] stream", err);
          controller.error(err);
        } finally {
          await logAiUsage({
            userId,
            route: "write",
            model: CLAUDE_MODEL,
            inputTokens,
            outputTokens,
          });
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/write]", err);
    return NextResponse.json(
      { error: "Le service de génération est momentanément indisponible." },
      { status: 500 }
    );
  }
}
