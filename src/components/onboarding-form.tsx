"use client";

import { useMemo, useState, useTransition } from "react";
import {
  completeOnboarding,
  saveOnboardingProgress,
} from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type OnboardingProfile = {
  job: string | null;
  audience: string | null;
  goal: string | null;
  sample_posts: string | null;
  onboarding_step: number | null;
} | null;

export type OnboardingMemoryEntry = {
  category: string;
  content: string;
  source: string;
  created_at: string;
};

const STEPS = [
  "Qui es-tu ?",
  "Tes anecdotes",
  "Tes positions",
  "Tes points clés",
];

const GOALS = [
  "Visibilité",
  "Générer des prospects",
  "Recrutement",
  "Développer mon réseau",
  "Autre",
];

function emptyList(min = 1) {
  return Array.from({ length: min }, () => "");
}

function pickMemory(memory: OnboardingMemoryEntry[], category: string) {
  return memory
    .filter((entry) => entry.category === category)
    .map((entry) => entry.content);
}

export function OnboardingForm({
  profile,
  memory,
}: {
  profile: OnboardingProfile;
  memory: OnboardingMemoryEntry[];
}) {
  const initialAnecdotes = useMemo(() => {
    const values = pickMemory(memory, "anecdote");
    return values.length > 0 ? values.slice(0, 3) : emptyList();
  }, [memory]);

  const initialPositions = useMemo(() => {
    const values = pickMemory(memory, "position");
    return values.length > 0 ? values.slice(0, 3) : emptyList();
  }, [memory]);

  const [step, setStep] = useState(
    Math.min(Math.max(profile?.onboarding_step ?? 1, 1), 4)
  );
  const [job, setJob] = useState(profile?.job ?? "");
  const [audience, setAudience] = useState(profile?.audience ?? "");
  const [goal, setGoal] = useState(profile?.goal ?? "");
  const [anecdotes, setAnecdotes] = useState(initialAnecdotes);
  const [positions, setPositions] = useState(initialPositions);
  const [expertise, setExpertise] = useState(
    pickMemory(memory, "expertise")[0] ?? ""
  );
  const [retourExperience, setRetourExperience] = useState(
    pickMemory(memory, "retour_experience")[0] ?? ""
  );
  const [samplePosts, setSamplePosts] = useState(profile?.sample_posts ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function buildFormData(nextStep: number) {
    const formData = new FormData();
    formData.set("onboarding_step", String(nextStep));
    formData.set("job", job);
    formData.set("audience", audience);
    formData.set("goal", goal);
    for (const anecdote of anecdotes) formData.append("anecdotes", anecdote);
    for (const position of positions) formData.append("positions", position);
    formData.set("expertise", expertise);
    formData.set("retour_experience", retourExperience);
    formData.set("sample_posts", samplePosts);
    return formData;
  }

  function validateStepOne() {
    if (!job.trim() || !audience.trim() || !goal.trim()) {
      setError("Remplis ton métier, ta cible et ton objectif pour continuer.");
      return false;
    }
    return true;
  }

  function goNext() {
    if (step === 1 && !validateStepOne()) return;
    const nextStep = Math.min(step + 1, 4);
    setError(null);
    startTransition(async () => {
      const result = await saveOnboardingProgress(buildFormData(nextStep));
      if (result.error) {
        setError(result.error);
        return;
      }
      setStep(nextStep);
    });
  }

  function submit() {
    if (!validateStepOne()) return;
    setError(null);
    startTransition(async () => {
      const result = await completeOnboarding(buildFormData(4));
      if (result?.error) setError(result.error);
    });
  }

  function updateList(
    values: string[],
    index: number,
    value: string,
    setter: (next: string[]) => void
  ) {
    setter(values.map((item, i) => (i === index ? value : item)));
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-card px-4 pb-28 pt-6 text-foreground md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-3xl overflow-x-hidden">
        <div className="mb-6 text-center md:mb-8">
          <div className="text-2xl font-black tracking-tight">
            <span className="text-primary">Echo</span>
          </div>
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
            Onboarding
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">
            Construis la mémoire d&apos;Echo
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Ces réponses donnent à Echo ta matière réelle : anecdotes,
            convictions, expertise et style.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-border bg-background p-4 shadow-sm md:mb-8">
          <div className="flex items-center justify-between gap-2">
            {STEPS.map((label, index) => {
              const stepNumber = index + 1;
              const active = stepNumber === step;
              const done = stepNumber < step;
              return (
                <div key={label} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold md:h-10 md:w-10 ${
                      active || done
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-primary"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span
                    className={`hidden text-center text-xs font-medium md:block ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Étape {step}/4 · {STEPS[step - 1]}
          </p>
        </div>

        <section className="min-h-[calc(100vh-270px)] rounded-2xl border border-border bg-background p-4 shadow-sm md:min-h-0 md:p-6">
          {step === 1 && (
            <div className="space-y-4 md:space-y-5">
              <h2 className="text-xl font-semibold md:text-2xl">Qui es-tu ?</h2>
              <div className="space-y-2">
                <Label htmlFor="job">Ton métier / secteur</Label>
                <Input
                  id="job"
                  value={job}
                  onChange={(event) => setJob(event.target.value)}
                  placeholder="Ex : consultante RH, fondateur SaaS, freelance tech..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Ta cible LinkedIn</Label>
                <Input
                  id="audience"
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  placeholder="Ex : dirigeants de PME, RH, freelances tech..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Ton objectif LinkedIn</Label>
                <select
                  id="goal"
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-10 md:text-sm"
                >
                  <option value="" disabled>
                    Choisis un objectif...
                  </option>
                  {GOALS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 md:space-y-5">
              <h2 className="text-xl font-semibold md:text-2xl">Tes anecdotes</h2>
              {anecdotes.map((value, index) => (
                <div key={index} className="space-y-2">
                  <Label>
                    {index === 0
                      ? "Raconte une expérience marquante dans ton parcours professionnel"
                      : "Une autre si tu en as une (optionnel)"}
                  </Label>
                  <Textarea
                    value={value}
                    onChange={(event) =>
                      updateList(anecdotes, index, event.target.value, setAnecdotes)
                    }
                    rows={5}
                    placeholder={
                      index === 0
                        ? "Ex : En 2022 j'ai lancé un produit qui a échoué. Ça m'a appris que..."
                        : "Une autre anecdote professionnelle..."
                    }
                  />
                </div>
              ))}
              {anecdotes.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAnecdotes([...anecdotes, ""])}
                  className="w-full sm:w-auto"
                >
                  Ajouter une anecdote
                </Button>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 md:space-y-5">
              <h2 className="text-xl font-semibold md:text-2xl">Tes positions</h2>
              {positions.map((value, index) => (
                <div key={index} className="space-y-2">
                  <Label>
                    {index === 0
                      ? "Quelle opinion tu défends dans ton domaine que peu de gens osent dire ?"
                      : index === 1
                        ? "Une croyance forte sur ton métier ?"
                        : "Une autre position forte (optionnel)"}
                  </Label>
                  <Textarea
                    value={value}
                    onChange={(event) =>
                      updateList(positions, index, event.target.value, setPositions)
                    }
                    rows={5}
                    placeholder={
                      index === 0
                        ? "Ex : Je pense que le management bienveillant est souvent une façade..."
                        : "Ex : La technique sans vision ne mène nulle part..."
                    }
                  />
                </div>
              ))}
              {positions.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPositions([...positions, ""])}
                  className="w-full sm:w-auto"
                >
                  Ajouter une position
                </Button>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 md:space-y-5">
              <h2 className="text-xl font-semibold md:text-2xl">Tes points clés</h2>
              <div className="space-y-2">
                <Label htmlFor="expertise">
                  Quelle est ta principale expertise ou compétence reconnue ?
                </Label>
                <Textarea
                  id="expertise"
                  value={expertise}
                  onChange={(event) => setExpertise(event.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retour_experience">
                  Un retour d&apos;expérience concret que tu pourrais partager ?
                </Label>
                <Textarea
                  id="retour_experience"
                  value={retourExperience}
                  onChange={(event) => setRetourExperience(event.target.value)}
                  rows={5}
                  placeholder="Ex : J'ai accompagné 40 PME sur leur transformation digitale, ce que j'ai observé c'est..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sample_posts">
                  Colle ici 3 à 5 de tes anciens posts LinkedIn
                  <span className="ml-1 text-muted-foreground">
                    (optionnel mais recommandé)
                  </span>
                </Label>
                <Textarea
                  id="sample_posts"
                  value={samplePosts}
                  onChange={(event) => setSamplePosts(event.target.value)}
                  rows={8}
                  placeholder="Colle tes posts ici, séparés par une ligne vide. Echo s'en servira pour comprendre ton rythme, tes formulations et ta structure."
                />
              </div>
            </div>
          )}

          {error && (
            <p className="mt-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="sticky bottom-0 -mx-4 mt-8 grid grid-cols-2 gap-3 border-t border-border bg-background/95 p-4 backdrop-blur md:static md:mx-0 md:flex md:items-center md:justify-between md:border-t-0 md:bg-transparent md:p-0 md:backdrop-blur-0">
            <Button
              type="button"
              variant="outline"
              disabled={step === 1 || isPending}
              onClick={() => setStep(Math.max(step - 1, 1))}
              className="w-full md:w-auto"
            >
              Précédent
            </Button>
            {step < 4 ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={isPending}
                className="w-full md:w-auto"
              >
                {isPending ? "Sauvegarde..." : "Suivant"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={submit}
                disabled={isPending}
                className="w-full bg-primary text-primary-foreground hover:opacity-90 md:w-auto"
              >
                {isPending ? "Lancement..." : "Lancer Echo →"}
              </Button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
