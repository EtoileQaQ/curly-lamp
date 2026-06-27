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

type WriteMode = "idle" | "generating" | "clarifying" | "post_ready";

type WriteApiResponse =
  | { mode: "post"; content: string }
  | { mode: "clarifying"; questions: string };

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
  const [originalIdea, setOriginalIdea] = useState(idea);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [writeMode, setWriteMode] = useState<WriteMode>("idle");
  const [error, setError] = useState<string | null>(null);

  const [score, setScore] = useState<ScoreData | null>(null);
  const [scoring, setScoring] = useState(false);
  // Permet d'annuler une génération en cours (changement de page, régénération)
  // pour ne pas laisser tourner un appel Anthropic abandonné.
  const abortRef = useRef<AbortController | null>(null);
  const initialGenerationRef = useRef(false);

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
      options?: { fromClarification?: boolean }
    ) => {
      // Annule toute génération précédente encore en cours.
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const { signal } = controller;

      setWriteMode("generating");
      setLoading(true);
      setError(null);
      setScore(null);
      try {
        const payload = options?.fromClarification
          ? {
              mode: "generate_from_clarification",
              originalIdea,
              clarificationExchange: content,
              instruction,
            }
          : {
              mode: "generate",
              idea: originalIdea,
              instruction,
            };
        const res = await fetch("/api/write", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (res.status === 402 && data.error === "limit_reached") {
            router.push("/#tarifs");
            return;
          }
          throw new Error(data.error || "Une erreur est survenue.");
        }

        let data: WriteApiResponse;
        try {
          data = (await res.json()) as WriteApiResponse;
        } catch {
          setWriteMode("idle");
          throw new Error("Réponse IA invalide. Réessaie.");
        }

        if (data.mode === "clarifying" && typeof data.questions === "string") {
          setContent(data.questions);
          setWriteMode("clarifying");
          return;
        }

        if (data.mode === "post" && typeof data.content === "string") {
          setContent(data.content);
          setWriteMode("post_ready");
          return;
        }

        setWriteMode("idle");
        throw new Error("Réponse IA incomplète. Réessaie.");
      } catch (err) {
        // Annulation volontaire (démontage / régénération) : on ignore.
        if (signal.aborted) return;
        setWriteMode("idle");
        setError(err instanceof Error ? err.message : "Erreur inconnue.");
      } finally {
        // Ne touche l'état que si cette génération est toujours la courante.
        if (abortRef.current === controller) setLoading(false);
      }
    },
    [content, originalIdea, router]
  );

  const changeIdea = useCallback(() => {
    abortRef.current?.abort();
    setOriginalIdea("");
    setContent("");
    setWriteMode("idle");
    router.push("/ideas");
  }, [router]);

  // Génération automatique au chargement (avec l'angle imposé s'il y en a un).
  // Au démontage, on annule la génération en cours pour ne pas laisser un appel
  // Anthropic tourner dans le vide.
  useEffect(() => {
    setOriginalIdea(idea);
    if (initialGenerationRef.current) return;
    initialGenerationRef.current = true;
    generate(initialInstruction);
    return () => abortRef.current?.abort();
  }, [generate, idea, initialInstruction]);

  const isGenerating = writeMode === "generating" || loading;

  return (
    <main className="min-h-screen overflow-x-hidden bg-card pb-28 text-foreground md:pb-0">
      <AppHeader />

      <section className="mx-auto w-full max-w-3xl overflow-x-hidden p-4 md:px-6 md:py-10 lg:px-8">
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm md:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
            Sujet du post
          </p>
          <h1 className="mt-2 break-words text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">
            {originalIdea || idea}
          </h1>
        </div>

        {error && (
          <p className="mt-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {isGenerating ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background px-4 py-16 text-center text-muted-foreground shadow-sm md:mt-8 md:py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Echo prépare ton post…
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5 md:mt-8 md:space-y-6">
            <form action={savePost} className="space-y-4">
              <input type="hidden" name="title" value={originalIdea || idea} />
              <input type="hidden" name="content" value={content} />
              <input type="hidden" name="writeMode" value={writeMode} />

              <div>
                <label
                  htmlFor="post-content"
                  className="mb-2 block text-xs font-medium text-foreground md:text-sm"
                >
                  {writeMode === "clarifying"
                    ? "Echo a besoin de précisions — réponds directement ci-dessous"
                    : "Ton post — modifie-le si besoin"}
                </label>
                <Textarea
                  id="post-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={18}
                  className="min-h-[360px] text-base leading-relaxed"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {writeMode === "clarifying"
                    ? "Ajoute tes réponses sous les questions, puis génère le post avec ces précisions."
                    : `${content.length} caractères · tu peux tout retoucher avant de valider.`}
                </p>
              </div>

              {writeMode === "clarifying" ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={changeIdea}
                    className="w-full"
                  >
                    Changer d&apos;idée
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => generate(undefined, { fromClarification: true })}
                    disabled={!content.trim()}
                    className="w-full"
                  >
                    Générer avec ces précisions →
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
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
                    <SaveButton
                      disabled={writeMode !== "post_ready" || !content.trim()}
                    />
                  </div>
                  {writeMode === "post_ready" && (
                    <button
                      type="button"
                      onClick={() =>
                        generate(
                          "Régénère ce post en tenant compte des précisions et modifications ci-dessous.",
                          { fromClarification: true }
                        )
                      }
                      className="text-sm text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
                    >
                      Régénérer avec des précisions
                    </button>
                  )}
                </div>
              )}
            </form>

            {/* Score Dwell Time (manuel) : calculé uniquement sur clic. */}
            {writeMode === "post_ready" &&
              (score === null && !scoring ? (
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
              ))}
          </div>
        )}
      </section>
    </main>
  );
}
