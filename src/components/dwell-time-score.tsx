"use client";

import { Gauge, RefreshCw, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ScoreData = {
  score: number;
  label: string;
  suggestions: string[];
};

// Couleurs selon le score : rouge < 4, orange 4-6, vert >= 7.
function colorOf(score: number) {
  if (score >= 7) return { bar: "bg-emerald-500", text: "text-emerald-600" };
  if (score >= 4) return { bar: "bg-orange-500", text: "text-orange-600" };
  return { bar: "bg-red-500", text: "text-red-600" };
}

export function DwellTimeScore({
  score,
  loading,
  onRecalculate,
  onApplySuggestion,
}: {
  score: ScoreData | null;
  loading: boolean;
  onRecalculate: () => void;
  onApplySuggestion: (suggestion: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          <Gauge className="h-5 w-5 text-primary" />
          Score Dwell Time
        </h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onRecalculate}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Recalculer
        </Button>
      </div>

      {loading && !score ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analyse du temps de lecture…
        </p>
      ) : score ? (
        <>
          <div className="mt-4 flex items-center gap-4">
            <span className={`text-4xl font-extrabold ${colorOf(score.score).text}`}>
              {score.score}
              <span className="text-lg font-semibold text-muted-foreground">/10</span>
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {score.label} temps de lecture estimé
              </p>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${colorOf(score.score).bar}`}
                  style={{ width: `${score.score * 10}%` }}
                />
              </div>
            </div>
          </div>

          {score.suggestions?.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pour améliorer ton score
              </p>
              {score.suggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <p className="text-sm text-foreground">{s}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onApplySuggestion(s)}
                    disabled={loading}
                    className="shrink-0 text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <Wand2 className="h-4 w-4" />
                    Appliquer
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Le score s&apos;affichera ici.
        </p>
      )}
    </div>
  );
}
