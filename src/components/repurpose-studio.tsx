"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  RefreshCw,
  Check,
  Wand2,
  Gauge,
} from "lucide-react";
import { savePost } from "@/app/write/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DwellTimeScore, type ScoreData } from "@/components/dwell-time-score";
import { AppHeader } from "@/components/app-header";
import {
  DialogueMatiereManquante,
  formatDialogueAnswers,
  type DialogueAnswer,
} from "@/components/dialogue-matiere-manquante";

type Analysis = {
  type: string;
  resume_en_3_points: string[];
  angle_suggere: string;
};

const TYPE_LABELS: Record<string, string> = {
  lien_article: "Lien / article",
  transcript: "Transcript",
  notes: "Notes",
  idee_brute: "Idée brute",
  texte_long: "Texte long",
};

function SaveButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={disabled || pending}>
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

export function RepurposeStudio() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "analyzed" | "editing">("input");

  const [source, setSource] = useState("");
  const [angle, setAngle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [points, setPoints] = useState<string[]>([]);

  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState("");

  const [score, setScore] = useState<ScoreData | null>(null);
  const [scoring, setScoring] = useState(false);
  const [missingMatter, setMissingMatter] = useState<{
    reason: string;
    questions: string[];
  } | null>(null);
  const [savingDialogue, setSavingDialogue] = useState(false);
  const matterCheckCache = useRef(
    new Map<
      string,
      { matiere_suffisante: boolean; raison?: string; questions?: string[] }
    >()
  );

  // Étape 1 : analyse du contenu collé.
  async function analyze() {
    setError(null);
    setAnalyzing(true);
    try {
      const res = await fetch("/api/repurpose/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analyse impossible.");
      setAnalysis(data);
      setPoints(data.resume_en_3_points ?? []);
      if (!angle.trim()) setAngle(data.angle_suggere ?? "");
      setStep("analyzed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setAnalyzing(false);
    }
  }

  // Étape 2 : génération du post à partir des points + angle.
  async function generate(options?: {
    skipMatterCheck?: boolean;
    dialogueAnswers?: string;
  }) {
    setError(null);
    setGenerating(true);
    setScore(null);
    try {
      if (!options?.skipMatterCheck) {
        const userInput = `Angle : ${angle || "Aucun"}\nPoints : ${points.join(
          "\n"
        )}\nSource : ${source}`;
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
          });
          setGenerating(false);
          return;
        }
      }

      const res = await fetch("/api/repurpose/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          points,
          angle,
          source,
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
        throw new Error(data.error || "Génération impossible.");
      }

      // Lecture du flux : on bascule sur l'éditeur et on remplit en direct.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setContent("");
      setStep("editing");
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setContent(acc);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setGenerating(false);
    }
  }

  async function submitDialogueAnswers(answers: DialogueAnswer[]) {
    const formatted = formatDialogueAnswers(answers);
    setSavingDialogue(true);
    try {
      await fetch("/api/memory/dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      setMissingMatter(null);
      await generate({ skipMatterCheck: true, dialogueAnswers: formatted });
    } finally {
      setSavingDialogue(false);
    }
  }

  async function computeScore(text: string) {
    if (!text.trim()) return;
    setScoring(true);
    try {
      const res = await fetch("/api/dwell-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (res.ok) setScore(data);
    } finally {
      setScoring(false);
    }
  }

  function updatePoint(index: number, value: string) {
    setPoints((prev) => prev.map((p, i) => (i === index ? value : p)));
  }

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
          setMissingMatter(null);
          generate({ skipMatterCheck: true });
        }}
      />

      <section className="mx-auto w-full max-w-3xl overflow-x-hidden p-4 md:px-6 md:py-12 lg:px-8">
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm md:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
            Repurposing
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">
            Transforme ta matière en post LinkedIn
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Colle n&apos;importe quoi : un lien, un article, des notes, un
            transcript… Echo en fait un post LinkedIn dans ton style.
          </p>
        </div>

        {error && (
          <p className="mt-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {/* ÉTAPE 1 — Saisie */}
        {step === "input" && (
          <div className="mt-6 space-y-4 rounded-2xl border border-border bg-background p-5 shadow-sm md:mt-8 md:space-y-5 md:p-6">
            <div className="space-y-2">
              <Label htmlFor="source">Ton contenu source</Label>
              <Textarea
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                rows={10}
                className="min-h-[220px]"
                placeholder="Colle ici n'importe quoi : lien, article, notes de réunion, idée brute, transcript..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="angle">Angle souhaité (optionnel)</Label>
              <Input
                id="angle"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                placeholder="Ex. Retour d'expérience, Conseil pratique, Prise de position…"
              />
            </div>
            <Button
              size="lg"
              onClick={analyze}
              disabled={analyzing || source.trim().length < 10}
              className="w-full sm:w-auto"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  J&apos;analyse ton contenu…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Générer un post LinkedIn à partir de ça
                </>
              )}
            </Button>
          </div>
        )}

        {/* ÉTAPE 2 — Idées extraites */}
        {step === "analyzed" && analysis && (
          <div className="mt-6 space-y-4 rounded-2xl border border-border bg-background p-5 shadow-sm md:mt-8 md:space-y-5 md:p-6">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Type détecté : {TYPE_LABELS[analysis.type] ?? analysis.type}
            </div>

            <div className="space-y-3">
              <Label>Les 3 idées clés extraites (modifiables)</Label>
              {points.map((p, i) => (
                <div key={i} className="rounded-2xl border border-border bg-background p-3">
                  <Textarea
                    value={p}
                    onChange={(e) => updatePoint(i, e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="angle2">Angle</Label>
              <Input
                id="angle2"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Button
                variant="outline"
                onClick={() => setStep("input")}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Modifier la source
              </Button>
              <Button
                size="lg"
                onClick={() => generate()}
                disabled={generating}
                className="w-full sm:w-auto"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Je génère ton post…
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Générer mon post
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 — Éditeur */}
        {step === "editing" && (
          <div className="mt-6 space-y-5 rounded-2xl border border-border bg-background p-5 shadow-sm md:mt-8 md:space-y-6 md:p-6">
            <form action={savePost} className="space-y-4">
              <input type="hidden" name="title" value={angle || "Repurposing"} />
              <input type="hidden" name="content" value={content} />

              <div>
                <label
                  htmlFor="post-content"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Ton post (modifiable)
                </label>
                <Textarea
                  id="post-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={18}
                  className="text-base leading-relaxed"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {content.length} caractères · tu peux tout retoucher avant de
                  valider.
                </p>
              </div>

              <div className="grid gap-3 sm:flex sm:flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => generate()}
                  disabled={generating}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className="h-4 w-4" />
                  Régénérer
                </Button>
                <SaveButton disabled={!content.trim()} />
              </div>
            </form>

            {/* Score Dwell Time (manuel) */}
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
                onApplySuggestion={() => generate()}
              />
            )}
          </div>
        )}
      </section>
    </main>
  );
}
