import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import {
  anthropic,
  CLAUDE_MODEL,
  extractText,
  safeParseJson,
} from "@/lib/anthropic";
import { getMemoryForPrompt } from "@/lib/memory";
import { SYSTEM_PROMPT_MATTER_CHECK } from "@/lib/prompts";
import { checkAiRateLimit } from "@/lib/ratelimit";

const MatterCheckSchema = z.object({
  userInput: z.string().min(1).max(10000),
});

type MatterCheck = {
  matiere_suffisante: boolean;
  raison: string;
  questions: string[];
};

const FALLBACK: MatterCheck = {
  matiere_suffisante: true,
  raison: "",
  questions: [],
};

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

  const parsedInput = MatterCheckSchema.safeParse(
    await request.json().catch(() => null)
  );

  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "Matière invalide ou trop longue." },
      { status: 400 }
    );
  }

  const identityMemory = await getMemoryForPrompt(userId);
  const { userInput } = parsedInput.data;
  const memoryLength = identityMemory.trim().length;
  const inputLength = userInput.trim().length;

  // Heuristique économique : si tout est manifestement trop vide, on évite un
  // appel Anthropic et on pose directement des questions.
  if (memoryLength < 120 && inputLength < 80) {
    return NextResponse.json({
      matiere_suffisante: false,
      raison:
        "La mémoire et le sujet sont encore trop courts pour produire un post personnel.",
      questions: [
        "Quelle situation concrète t'a fait penser à ce sujet ?",
        "Quelle opinion personnelle veux-tu défendre ici ?",
        "As-tu un exemple vécu ou observé qui illustre cette idée ?",
      ],
    });
  }

  // À l'inverse, si la mémoire est déjà riche et le sujet exploitable, on évite
  // aussi un second appel IA avant la génération.
  if (memoryLength >= 700 && inputLength >= 40) {
    return NextResponse.json(FALLBACK);
  }

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 500,
      system: SYSTEM_PROMPT_MATTER_CHECK,
      messages: [
        {
          role: "user",
          content: `Voici la matière disponible pour générer un post LinkedIn authentique :

Mémoire identitaire : ${identityMemory || "Aucune mémoire identitaire disponible."}
Idée ou sujet fourni : ${userInput}

Évalue si cette matière est suffisante pour générer un post ancré dans une vraie expérience ou opinion personnelle (pas un post générique).

Réponds UNIQUEMENT en JSON :
{
  "matiere_suffisante": boolean,
  "raison": string,
  "questions": string[]
}`,
        },
      ],
    });

    const parsed = safeParseJson<MatterCheck>(extractText(message.content));
    if (!parsed || typeof parsed.matiere_suffisante !== "boolean") {
      return NextResponse.json(FALLBACK);
    }

    return NextResponse.json({
      matiere_suffisante: parsed.matiere_suffisante,
      raison: parsed.raison || "",
      questions: Array.isArray(parsed.questions)
        ? parsed.questions.slice(0, 3)
        : [],
    });
  } catch (err) {
    console.error("[/api/matter-check]", err);
    // En cas d'erreur de check, on ne bloque pas la génération.
    return NextResponse.json(FALLBACK);
  }
}
