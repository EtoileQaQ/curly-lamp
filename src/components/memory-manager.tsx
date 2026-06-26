"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Loader2, Brain, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addMemory, deleteMemory } from "@/app/profil/memoire/actions";
import { AppHeader } from "@/components/app-header";

export type MemoryEntry = {
  id: string;
  category: string;
  content: string;
  created_at: string;
};

const CATEGORIES = [
  { value: "conviction", label: "Conviction" },
  { value: "anecdote", label: "Anecdote" },
  { value: "position", label: "Position" },
  { value: "valeur", label: "Valeur" },
  { value: "experience_cle", label: "Expérience clé" },
];

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
);

const EXAMPLES = [
  {
    category: "conviction",
    content:
      "Je crois que la transparence est plus efficace que le perfectionnisme",
  },
  {
    category: "anecdote",
    content:
      "En 2021 j'ai lancé une boutique e-commerce qui a échoué, ça m'a appris à valider une idée avant de tout construire",
  },
  {
    category: "position",
    content: "Je suis contre le management par la peur",
  },
];

const MAX_ENTRIES = 20;

export function MemoryManager({ entries }: { entries: MemoryEntry[] }) {
  const [category, setCategory] = useState("conviction");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const atLimit = entries.length >= MAX_ENTRIES;

  function handleAdd() {
    setError(null);
    startTransition(async () => {
      const result = await addMemory(category, content);
      if (result?.error) {
        setError(result.error);
      } else {
        setContent("");
      }
    });
  }

  function applyExample(ex: { category: string; content: string }) {
    setCategory(ex.category);
    setContent(ex.content);
    setError(null);
  }

  function remove(id: string) {
    startTransition(() => deleteMemory(id));
  }

  return (
    <main className="min-h-screen bg-card text-foreground">
      <AppHeader />

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
              Mémoire
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight">
              Mon identité
            </h1>
            <p className="text-sm text-muted-foreground">
              Tes convictions, anecdotes et positions, pour des posts ancrés
              dans ta réalité.
            </p>
          </div>
        </div>
        </div>

        {/* Compteur */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {entries.length}/{MAX_ENTRIES} entrées
          </span>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${(entries.length / MAX_ENTRIES) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Formulaire d'ajout */}
        <div className="mt-4 rounded-2xl border border-border bg-background p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Ex. Je crois que la transparence est plus efficace que le perfectionnisme"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          )}

          <div className="mt-4">
            <Button
              onClick={handleAdd}
              disabled={isPending || atLimit || !content.trim()}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Ajouter à ma mémoire
            </Button>
            {atLimit && (
              <span className="ml-3 text-sm text-muted-foreground">
                Limite de {MAX_ENTRIES} atteinte.
              </span>
            )}
          </div>
        </div>

        {/* Liste ou état vide */}
        {entries.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-background p-8 text-center shadow-sm">
            <Lightbulb className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3 font-medium text-foreground">
              Ta mémoire est vide — donne vie à ton Echo !
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Clique sur un exemple pour démarrer :
            </p>
            <div className="mt-4 grid gap-2 text-left">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => applyExample(ex)}
                  className="rounded-xl border border-border bg-card p-3 text-sm transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="font-semibold text-primary">
                    {CATEGORY_LABEL[ex.category]} :{" "}
                  </span>
                  <span className="text-foreground">{ex.content}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {CATEGORIES.map((cat) => {
              const items = entries.filter((e) => e.category === cat.value);
              if (items.length === 0) return null;
              return (
                <div key={cat.value}>
                  <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    {cat.label} ({items.length})
                  </h2>
                  <div className="space-y-2">
                    {items.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-4 shadow-sm"
                      >
                        <p className="text-sm text-foreground">{entry.content}</p>
                        <button
                          onClick={() => remove(entry.id)}
                          disabled={isPending}
                          className="shrink-0 text-muted-foreground transition hover:text-destructive"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
