import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { addDialogueMemoryEntry } from "@/lib/memory";

const DialogueMemorySchema = z.object({
  answers: z
    .array(
      z.object({
        question: z.string().min(1).max(500),
        answer: z.string().min(20).max(3000),
      })
    )
    .min(1)
    .max(3),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsedInput = DialogueMemorySchema.safeParse(
    await request.json().catch(() => null)
  );

  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "Réponses invalides ou trop courtes." },
      { status: 400 }
    );
  }

  for (const item of parsedInput.data.answers) {
    await addDialogueMemoryEntry(
      userId,
      `Question : ${item.question}\nRéponse : ${item.answer}`
    );
  }

  return NextResponse.json({ success: true });
}
