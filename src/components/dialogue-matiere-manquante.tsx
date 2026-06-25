"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export type DialogueAnswer = {
  question: string;
  answer: string;
};

export function formatDialogueAnswers(answers: DialogueAnswer[]) {
  return answers
    .map(
      (item, index) =>
        `${index + 1}. ${item.question}\nRéponse : ${item.answer}`
    )
    .join("\n\n");
}

export function DialogueMatiereManquante({
  open,
  reason,
  questions,
  loading,
  onSubmit,
  onGenerateAnyway,
}: {
  open: boolean;
  reason: string;
  questions: string[];
  loading?: boolean;
  onSubmit: (answers: DialogueAnswer[]) => void;
  onGenerateAnyway: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [answers, setAnswers] = useState<DialogueAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[index] ?? "";
  const isLast = index >= questions.length - 1;

  function next() {
    if (draft.trim().length < 20) {
      setError("Ajoute au moins 20 caractères pour donner de la matière à Echo.");
      return;
    }

    const nextAnswers = [
      ...answers,
      { question: currentQuestion, answer: draft.trim() },
    ];
    setAnswers(nextAnswers);
    setDraft("");
    setError(null);

    if (isLast) {
      onSubmit(nextAnswers);
      return;
    }

    setIndex(index + 1);
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Echo a besoin d&apos;en savoir plus</DialogTitle>
          <DialogDescription>
            {reason ||
              "La matière disponible risque de produire un post trop générique."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Question {index + 1}/{questions.length}
          </p>
          <p className="mt-2 font-medium text-foreground">{currentQuestion}</p>
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={5}
            className="mt-4 bg-background"
            placeholder="Réponds avec un exemple concret, une situation vécue, une opinion ou une nuance..."
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {draft.trim().length}/20 caractères minimum
          </p>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <Button onClick={next} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {isLast
              ? "Générer mon post avec ces infos →"
              : "Question suivante →"}
          </Button>
          <button
            type="button"
            onClick={onGenerateAnyway}
            disabled={loading}
            className="text-sm text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline disabled:opacity-60"
          >
            Générer quand même sans ces infos
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
