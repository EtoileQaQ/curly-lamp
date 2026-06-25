"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, Check, Sparkles, Gauge } from "lucide-react";
import { savePost } from "@/app/write/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DwellTimeScore, type ScoreData } from "@/components/dwell-time-score";
import { AppHeader } from "@/components/app-header";
import {
  DialogueMatiereManquante,
  formatDialogueAnswers,
  type DialogueAnswer,
} from "@/components/dialogue-matiere-manquante";

function SaveButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={disabled || pending}
      className="w-full"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Enregistrement…
        </>
      ) : (
        <>
          <Check className="h-4 w-4" />
          Valider ce post
        </>
      )}
    </Button>
  );
}

export function PostEditor({
  idea,
  initialInstruction,
}: {
  idea: string;
  initialInstruction?: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [score, setScore] = useState<ScoreData | null>(null);
  const [scoring, setScoring] = useState(false);
  const [missingMatter, setMissingMatter] = useState<{
    reason: string;
    questions: string[];
    instruction?: string;
  } | null>(null);
  const [savingDialogue, setSavingDialogue] = useState(false);
  const matterCheckCache = useRef(
    new Map<
      string,
      { matiere_suffisante: boolean; raison?: string; questions?: string[] }
    >()
  );

  // Demande le score de dwell time pour un texte donné.
  const computeScore = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setScoring(true);
    try {
      const res = await fetch("/api/dwell-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (res.ok) {
        setScore(data);
      }
    } finally {
      setScoring(false);
    }
  }, []);

  // Génère (ou régénère) le post ; une consigne optionnelle vient des suggestions.
  const generate = useCallback(
    async (
      instruction?: string,
      options?: { skipMatterCheck?: boolean; dialogueAnswers?: string }
    ) => {
      setLoading(true);
      setError(null);
      setScore(null);
      try {
        if (!options?.skipMatterCheck) {
          const userInput = `${idea}${instruction ? `\n${instruction}` : ""}`;
          const cacheKey = userInput.trim();
          let check = matterCheckCache.current.get(cacheKey) ?? null;

          if (!check) {
            const checkRes = await fetch("/api/matter-check", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userInput }),
            });
            check = await checkRes.json().catch(() => null);
            if (checkRes.ok && check) {
              matterCheckCache.current.set(cacheKey, check);
            }
          }

          if (
            check &&
            check.matiere_suffisante === false &&
            Array.isArray(check.questions) &&
            check.questions.length > 0
          ) {
            setMissingMatter({
              reason: check.raison ?? "",
              questions: check.questions.slice(0, 3),
              instruction,
            });
            setLoading(false);
            return;
          }
        }

        const res = await fetch("/api/write", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idea,
            instruction,
            dialogueAnswers: options?.dialogueAnswers,
          }),
        });

        // Les erreurs (quota, limite, etc.) arrivent en JSON, pas en flux.
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          if (res.status === 402 && data.error === "limit_reached") {
            router.push("/#tarifs");
            return;
          }
          throw new Error(data.error || "Une erreur est survenue.");
        }

        // Lecture du flux : on affiche le texte au fur et à mesure.
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        setLoading(false);
        setContent("");
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setContent(acc);
        }
        if (!acc.trim()) {
          setError("Réponse vide de l'IA. Réessaie.");
        }
        // Score en mode manuel : rien ne se calcule automatiquement.
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue.");
      } finally {
        setLoading(false);
      }
    },
    [idea, router]
  );

  async function submitDialogueAnswers(answers: DialogueAnswer[]) {
    const formatted = formatDialogueAnswers(answers);
    setSavingDialogue(true);
    try {
      await fetch("/api/memory/dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const instruction = missingMatter?.instruction;
      setMissingMatter(null);
      await generate(instruction, {
        skipMatterCheck: true,
        dialogueAnswers: formatted,
      });
    } finally {
      setSavingDialogue(false);
    }
  }

  // Génération automatique au chargement (avec l'angle imposé s'il y en a un).
  useEffect(() => {
    generate(initialInstruction);
  }, [generate, initialInstruction]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-card pb-28 text-foreground md:pb-0">
      <AppHeader />
      <DialogueMatiereManquante
        open={!!missingMatter}
        reason={missingMatter?.reason ?? ""}
        questions={missingMatter?.questions ?? []}
        loading={savingDialogue}
        onSubmit={submitDialogueAnswers}
        onGenerateAnyway={() => {
          const instruction = missingMatter?.instruction;
          setMissingMatter(null);
          generate(instruction, { skipMatterCheck: true });
        }}
      />

      <section className="mx-auto w-full max-w-3xl overflow-x-hidden p-4 md:px-6 md:py-10 lg:px-8">
        <p className="text-xs font-medium text-muted-foreground md:text-sm">
          Sujet du post
        </p>
        <h1 className="mt-1 break-words text-2xl font-medium tracking-tight md:text-3xl lg:text-4xl">
          {idea}
        </h1>

        {error && (
          <p className="mt-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {loading ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background px-4 py-16 text-center text-muted-foreground md:mt-8 md:py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Echo rédige ton post dans ton style…
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5 md:mt-8 md:space-y-6">
            <form action={savePost} className="space-y-4">
              <input type="hidden" name="title" value={idea} />
              <input type="hidden" name="content" value={content} />

              <div>
                <label
                  htmlFor="post-content"
                  className="mb-2 block text-xs font-medium text-foreground md:text-sm"
                >
                  Ton post (modifiable)
                </label>
                <Textarea
                  id="post-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={18}
                  className="min-h-[360px] text-base leading-relaxed"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {content.length} caractères · tu peux tout retoucher avant de
                  valider.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => generate()}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4" />
                  Régénérer
                </Button>
                <SaveButton disabled={!content.trim()} />
              </div>
            </form>

            {/* Score Dwell Time (manuel) : calculé uniquement sur clic. */}
            {score === null && !scoring ? (
              <div className="grid gap-4 rounded-2xl border border-border bg-background p-4 shadow-sm sm:flex sm:items-center sm:justify-between md:p-5">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-foreground">
                    <Gauge className="h-5 w-5 text-primary" />
                    Score Dwell Time
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Estime le temps de lecture de ton post (1 appel à l&apos;IA).
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => computeScore(content)}
                  className="w-full shrink-0 sm:w-auto"
                >
                  <Gauge className="h-4 w-4" />
                  Calculer mon score
                </Button>
              </div>
            ) : (
              <DwellTimeScore
                score={score}
                loading={scoring}
                onRecalculate={() => computeScore(content)}
                onApplySuggestion={(s) => generate(s)}
              />
            )}
          </div>
        )}
      </section>
    </main>
  );
}
