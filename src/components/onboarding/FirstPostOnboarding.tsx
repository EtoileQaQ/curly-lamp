"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  completeFirstPostOnboarding,
  saveFirstPostAsDraft,
  saveFirstPostIdea,
  saveGeneratedFirstPost,
  saveOnboardingStep,
  savePersona,
} from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { PersonaCard } from "@/components/onboarding/PersonaCard";
import { StreamingPost } from "@/components/onboarding/StreamingPost";
import type { Persona, Profile } from "@/lib/profile";

const TOTAL_STEPS = 4;

const PERSONAS: Array<{ value: Persona; label: string; icon: string }> = [
  { value: "freelance", label: "Freelance / Indépendant", icon: "▣" },
  { value: "dirigeant", label: "Dirigeant / Manager", icon: "▤" },
  { value: "consultant", label: "Consultant", icon: "◈" },
  { value: "autre", label: "Autre profil", icon: "○" },
];

function getInitialStep(profile: Profile) {
  const saved = Math.min(Math.max(profile.onboarding_step || 1, 1), 4);
  if (!profile.persona) return 1;
  if (!profile.first_post_idea && saved > 2) return 2;
  if (!profile.first_post_generated && saved > 3) return 3;
  return saved;
}

export function FirstPostOnboarding({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [step, setStep] = useState(() => getInitialStep(profile));
  const [persona, setPersona] = useState<Persona | null>(profile.persona);
  const [idea, setIdea] = useState(profile.first_post_idea ?? "");
  const [generatedPost, setGeneratedPost] = useState(
    profile.first_post_generated ?? ""
  );
  const [showDashboardLink, setShowDashboardLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canContinueIdea = idea.trim().length >= 30;
  const recommendedLengthReached = idea.trim().length >= 50;

  const personaLabel = useMemo(
    () => PERSONAS.find((item) => item.value === persona)?.label ?? "autre profil",
    [persona]
  );

  useEffect(() => {
    if (step !== 4 || showDashboardLink) return;
    const timer = window.setTimeout(() => setShowDashboardLink(true), 10_000);
    return () => window.clearTimeout(timer);
  }, [showDashboardLink, step]);

  function goToStep(nextStep: number) {
    setStep(nextStep);
    startTransition(async () => {
      await saveOnboardingStep(nextStep);
    });
  }

  function selectPersona(value: Persona) {
    setPersona(value);
    setError(null);
    startTransition(async () => {
      const result = await savePersona(value);
      if (result.error) setError(result.error);
    });
  }

  function continueToIdea() {
    if (!persona) return;
    goToStep(2);
  }

  function continueToGeneration() {
    if (!canContinueIdea) return;
    setError(null);
    startTransition(async () => {
      const result = await saveFirstPostIdea(idea);
      if (result.error) {
        setError(result.error);
        return;
      }
      setStep(3);
    });
  }

  const handleComplete = useCallback(
    (text: string) => {
      if (!text) return;
      setGeneratedPost(text);
      startTransition(async () => {
        const result = await saveGeneratedFirstPost(text);
        if (result.error) {
          setError(result.error);
          return;
        }
        window.setTimeout(() => setStep(4), 800);
      });
    },
    [startTransition]
  );

  async function copyPost() {
    await navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setShowDashboardLink(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function editInDashboard() {
    startTransition(async () => {
      const result = await saveFirstPostAsDraft(generatedPost);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`/dashboard${result.id ? `?firstPost=${result.id}` : ""}`);
    });
  }

  function finish() {
    startTransition(async () => {
      await completeFirstPostOnboarding();
    });
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-[#12101f] sm:px-6 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col">
        <header>
          <div className="text-center text-2xl font-black tracking-tight text-[#6c63ff]">
            Echo
          </div>
          <div className="mt-8">
            <OnboardingStepper currentStep={step} totalSteps={TOTAL_STEPS} />
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-10">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Avant de commencer, tu es plutôt…
              </h1>
              <p className="mt-3 text-slate-500">
                Ça permet à Echo d&apos;adapter les exemples à ton contexte.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {PERSONAS.map((item) => (
                  <PersonaCard
                    key={item.value}
                    icon={item.icon}
                    label={item.label}
                    selected={persona === item.value}
                    onClick={() => selectPersona(item.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                C&apos;est quoi ton dernier apprentissage professionnel ?
              </h1>
              <p className="mt-3 text-slate-500">
                Une anecdote, une erreur, une découverte, une conviction. Même
                si c&apos;est encore brouillon.
              </p>
              <div className="mt-8">
                <Textarea
                  value={idea}
                  onChange={(event) => setIdea(event.target.value)}
                  placeholder="Ex : J'ai réalisé cette semaine que mes clients ne lisent jamais mes propositions en entier, alors j'ai changé mon format…"
                  className="min-h-[120px] resize-y rounded-xl"
                />
                <div
                  className={`mt-2 text-right text-xs ${
                    recommendedLengthReached ? "text-[#6c63ff]" : "text-slate-400"
                  }`}
                >
                  {idea.trim().length} caractères · 50 recommandés
                </div>
              </div>
            </div>
          )}

          {step === 3 && persona && (
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Echo prépare ton post…
              </h1>
              {!generatedPost && (
                <p className="mt-3 text-slate-500">
                  Il analyse ton idée et choisit l&apos;angle le plus fort.
                </p>
              )}
              <div className="mt-8">
                <StreamingPost
                  idea={idea}
                  persona={personaLabel}
                  onComplete={handleComplete}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Ton premier post est prêt ✦
              </h1>
              <p className="mt-3 text-slate-500">
                Copie-le, colle-le sur LinkedIn, et reviens nous dire comment il
                a performé.
              </p>
              <div className="mt-8 whitespace-pre-wrap rounded-xl border border-[#e5e2ff] bg-white p-4 text-sm leading-relaxed shadow-sm">
                {generatedPost}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button
                  onClick={copyPost}
                  className={copied ? "bg-emerald-600 hover:bg-emerald-600" : ""}
                >
                  {copied ? "Copié ✓" : "Copier le post"}
                </Button>
                <Button variant="outline" onClick={editInDashboard}>
                  Modifier dans l&apos;éditeur →
                </Button>
              </div>
              {showDashboardLink && (
                <button
                  type="button"
                  onClick={finish}
                  className="mt-6 text-sm font-semibold text-slate-500 underline-offset-4 transition hover:text-[#12101f] hover:underline"
                >
                  Accéder au dashboard →
                </button>
              )}
            </div>
          )}
        </section>

        <footer className="grid grid-cols-2 gap-3 border-t border-[#e5e2ff] pt-5">
          <Button
            type="button"
            variant="outline"
            disabled={step === 1 || (step === 3 && !generatedPost) || isPending}
            onClick={() => goToStep(Math.max(1, step - 1))}
          >
            Retour
          </Button>

          {step === 1 && (
            <Button disabled={!persona || isPending} onClick={continueToIdea}>
              Continuer
            </Button>
          )}
          {step === 2 && (
            <Button
              disabled={!canContinueIdea || isPending}
              onClick={continueToGeneration}
            >
              Continuer →
            </Button>
          )}
          {step === 3 && (
            <Button disabled={!generatedPost || isPending} onClick={() => goToStep(4)}>
              Voir mon post
            </Button>
          )}
          {step === 4 && <span />}
        </footer>
      </div>
    </main>
  );
}
