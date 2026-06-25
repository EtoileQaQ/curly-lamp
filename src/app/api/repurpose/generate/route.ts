import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { getIdentityMemoryBlock } from "@/lib/identity";
import { hasReachedFreeLimit } from "@/lib/plan";
import { SYSTEM_PROMPT_POST_GENERATION } from "@/lib/prompts";
import { checkAiRateLimit } from "@/lib/ratelimit";

const GenerateSchema = z.object({
  points: z.array(z.string().max(1000)).max(10).default([]),
  angle: z.string().max(500).default(""),
  source: z.string().max(20000).default(""),
  dialogueAnswers: z.string().max(5000).optional(),
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

  // Limite du plan gratuit : 4 posts au total (repurposing inclus).
  if (await hasReachedFreeLimit(userId)) {
    return NextResponse.json({ error: "limit_reached" }, { status: 402 });
  }

  const parsedInput = GenerateSchema.safeParse(
    await request.json().catch(() => null)
  );
  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "Données invalides pour la génération." },
      { status: 400 }
    );
  }
  const { points, angle, source, dialogueAnswers } = parsedInput.data;

  if (points.length === 0 && !source) {
    return NextResponse.json(
      { error: "Aucun contenu à transformer." },
      { status: 400 }
    );
  }

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

  // La mémoire identitaire est transmise dans le message utilisateur pour garder
  // le prompt système centralisé et stable.
  const memoryBlock = await getIdentityMemoryBlock(userId);
  const identityMemory = memoryBlock || "Aucune";
  const userStyle = profile.sample_posts ?? "";
  const rawMaterial = `Contexte de l'utilisateur :
- Métier / secteur : ${profile.job}
- Cible : ${profile.audience}
- Objectif : ${profile.goal}

Idées clés extraites du contenu :
${points.map((p, i) => `${i + 1}. ${p}`).join("\n") || "Aucune idée clé fournie."}

${source ? `Contenu source :\n"""\n${source.slice(0, 3000)}\n"""` : ""}`;
  const additionalInstruction = angle || "Aucune";

  const userPrompt = `Voici la matière pour construire ce post :

STYLE D'ÉCRITURE DE L'UTILISATEUR :
"""
${userStyle}
"""

MÉMOIRE IDENTITAIRE (convictions, anecdotes, positions) :
${identityMemory}

MATIÈRE BRUTE (idée, expérience, ou contenu à repurposer) :
${rawMaterial}

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
    // Streaming : texte renvoyé au fur et à mesure de sa génération.
    const aiStream = await anthropic.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      system: SYSTEM_PROMPT_POST_GENERATION,
      messages: [{ role: "user", content: userPrompt }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of aiStream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          console.error("[/api/repurpose/generate] stream", err);
          controller.error(err);
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
    console.error("[/api/repurpose/generate]", err);
    return NextResponse.json(
      { error: "Le service de génération est momentanément indisponible." },
      { status: 500 }
    );
  }
}
