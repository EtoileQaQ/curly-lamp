"use client";

import { useMemo, useState, useTransition } from "react";
import { Edit3, Trash2, Brain, Loader2 } from "lucide-react";
import {
  addManualMemoryEntry,
  deleteMemoryEntry,
  updateMemoryEntry,
} from "@/app/memoire/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MemoryCategory, MemorySource, StoredMemoryEntry } from "@/lib/memory";

const MAX = 20;

const CATEGORY_META: Record<
  MemoryCategory,
  { label: string; singular: string }
> = {
  anecdote: { label: "Anecdotes", singular: "Anecdote" },
  position: { label: "Positions", singular: "Position" },
  expertise: { label: "Expertise", singular: "Expertise" },
  retour_experience: {
    label: "Retours d'expérience",
    singular: "Retour d'expérience",
  },
  style: { label: "Style d'écriture", singular: "Style d'écriture" },
};

const SOURCE_LABEL: Record<MemorySource, string> = {
  onboarding: "Onboarding",
  dialogue_generation: "Dialogue",
  manuel: "Manuel",
};

function progressColor(count: number) {
  if (count <= 14) return "bg-emerald-500";
  if (count <= 18) return "bg-orange-500";
  return "bg-red-500";
}

function relativeDate(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "il y a 1 jour";
  return `il y a ${days} jours`;
}

function truncate(content: string) {
  return content.length > 100 ? `${content.slice(0, 100)}...` : content;
}

export function MemoireManager({ entries }: { entries: StoredMemoryEntry[] }) {
  const [category, setCategory] = useState<MemoryCategory>("anecdote");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState<StoredMemoryEntry | null>(null);
  const [editContent, setEditContent] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const grouped = useMemo(() => {
    const result = new Map<MemoryCategory, StoredMemoryEntry[]>();
    for (const key of Object.keys(CATEGORY_META) as MemoryCategory[]) {
      result.set(key, []);
    }
    for (const entry of entries) {
      result.get(entry.category)?.push(entry);
    }
    return result;
  }, [entries]);

  const count = entries.length;
  const isFull = count >= MAX;

  function addEntry() {
    setMessage(null);
    startTransition(async () => {
      const result = await addManualMemoryEntry(category, content);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setContent("");
      setMessage("Entrée ajoutée à la mémoire.");
    });
  }

  function saveEdit() {
    if (!editing) return;
    setMessage(null);
    startTransition(async () => {
      const result = await updateMemoryEntry(editing.id, editContent);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setEditing(null);
      setEditContent("");
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteMemoryEntry(id);
      if (result.error) setMessage(result.error);
      setConfirmDelete(null);
    });
  }

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-4 overflow-x-hidden p-4 md:gap-6 md:px-6 md:py-10 lg:grid-cols-[1.4fr_0.9fr] lg:gap-8">
      <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-border bg-card px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Mémoire utilisée
          </span>
          <span className="text-sm font-semibold text-foreground">
            {count} / {MAX}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-accent">
          <div
            className={`h-full rounded-full ${progressColor(count)}`}
            style={{ width: `${Math.min((count / MAX) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="min-w-0">
        <div className="rounded-2xl border border-border bg-background p-4 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
                Mémoire
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">
                La mémoire d&apos;Echo
              </h1>
              <p className="text-sm text-muted-foreground">
                {count} / {MAX} entrées utilisées
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-accent">
            <div
              className={`h-full rounded-full ${progressColor(count)}`}
              style={{ width: `${Math.min((count / MAX) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 space-y-4 md:mt-6 md:space-y-6">
          {(Object.keys(CATEGORY_META) as MemoryCategory[]).map((key) => {
            const meta = CATEGORY_META[key];
            const items = grouped.get(key) ?? [];
            return (
              <section
                key={key}
                className="rounded-2xl border border-border bg-background p-4 shadow-sm md:p-5"
              >
                <h2 className="text-xl font-bold text-foreground md:text-2xl">
                  {meta.label}
                </h2>
                {items.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Aucune entrée dans cette catégorie.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {items.map((entry) => (
                      <div
                        key={entry.id}
                        className="w-full max-w-full overflow-hidden rounded-xl border border-border bg-card p-4"
                      >
                        <div className="flex min-w-0 items-start justify-between gap-3 md:gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="break-words text-sm leading-relaxed text-foreground md:text-base">
                              {truncate(entry.content)}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span className="rounded-full bg-background px-2 py-1 font-medium text-primary">
                                {SOURCE_LABEL[entry.source]}
                              </span>
                              <span>{relativeDate(entry.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              title="Modifier"
                              onClick={() => {
                                setEditing(entry);
                                setEditContent(entry.content);
                              }}
                              className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg bg-background text-muted-foreground transition hover:text-foreground md:h-9 md:w-9"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title="Supprimer"
                              onClick={() => setConfirmDelete(entry.id)}
                              className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg bg-background text-destructive transition hover:bg-destructive/10 md:h-9 md:w-9"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {confirmDelete === entry.id && (
                          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="text-sm font-medium text-red-800">
                              Supprimer cette entrée ?
                            </p>
                            <div className="mt-3 grid gap-2 sm:flex">
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-full sm:w-auto"
                                onClick={() => remove(entry.id)}
                                disabled={isPending}
                              >
                                Confirmer
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => setConfirmDelete(null)}
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-background p-4 shadow-sm md:p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
          Ajout manuel
        </p>
        <h2 className="mt-2 text-xl font-bold md:text-2xl">Ajouter une entrée</h2>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Plus ta mémoire est précise, moins Echo sonne générique.
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="memory-category">Catégorie</Label>
            <select
              id="memory-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as MemoryCategory)
              }
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-base md:h-10 md:text-sm"
            >
              {(Object.keys(CATEGORY_META) as MemoryCategory[]).map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_META[key].singular}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memory-content">Contenu</Label>
            <Textarea
              id="memory-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={8}
              placeholder="Ajoute une anecdote, une conviction, un retour d'expérience ou une formulation qui te ressemble..."
              disabled={isFull}
            />
            <p className="text-xs text-muted-foreground">
              {content.trim().length}/20 caractères minimum
            </p>
          </div>

          {isFull ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              Mémoire pleine — supprime une entrée pour en ajouter une nouvelle.
            </p>
          ) : (
            <Button
              onClick={addEntry}
              disabled={isPending || content.trim().length < 20}
              className="w-full bg-primary text-primary-foreground hover:opacity-90"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Ajouter à ma mémoire
            </Button>
          )}

          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
      </aside>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;entrée</DialogTitle>
            <DialogDescription>
              Ajuste la formulation sans perdre ce qui rend cette idée
              personnelle.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(event) => setEditContent(event.target.value)}
            rows={8}
            className="mt-4"
          />
          <div className="mt-4 grid gap-2 sm:flex sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setEditing(null)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button onClick={saveEdit} disabled={isPending} className="w-full sm:w-auto">
              Enregistrer les modifications
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
