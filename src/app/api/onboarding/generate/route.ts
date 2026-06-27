import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { checkAiRateLimit } from "@/lib/ratelimit";

const GenerateSchema = z.object({
  idea: z.string().min(30).max(3000),
  persona: z.string().min(1).max(80),
});

function sse(payload: unknown) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

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

  const parsed = GenerateSchema.safeParse(
    await request.json().catch(() => null)
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Idée ou persona invalide." },
      { status: 400 }
    );
  }

  const { idea, persona } = parsed.data;

  const system = `Tu es Echo, un assistant de ghostwriting LinkedIn expert.

Tu aides des professionnels français à transformer leurs idées brouillons en posts LinkedIn percutants, dans leur voix.
L'utilisateur est un(e) ${persona} francophone.
Génère un post LinkedIn de haute qualité à partir de l'idée fournie.
Règles strictes :

Commence par une accroche forte (1 à 2 lignes max qui donnent envie de lire la suite)
Corps du post : 3 à 5 paragraphes courts, chacun avec 1 idée centrale
Ton : direct, personnel, concret — jamais de jargon corporate
Utilise des sauts de ligne pour aérer (format LinkedIn natif)
Termine par une question ouverte ou une invitation à réagir
Ajoute 3 à 4 hashtags pertinents en dernière ligne
Longueur cible : 150 à 250 mots
Ne mets pas de titre, pas de "Post LinkedIn :", juste le post directement`;

  const aiStream = await anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 1100,
    system,
    messages: [
      {
        role: "user",
        content: `Idée de départ : "${idea}"`,
      },
    ],
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
            controller.enqueue(
              encoder.encode(sse({ type: "delta", text: event.delta.text }))
            );
          }
        }
        controller.enqueue(encoder.encode(sse({ type: "done" })));
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            sse({
              type: "error",
              message:
                error instanceof Error
                  ? error.message
                  : "Erreur de génération.",
            })
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
