"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export function ExploreZoneButton({ zoneName }: { zoneName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function exploreZone() {
    setLoading(true);
    try {
      await fetch("/api/theme-analysis/explore", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoneName }),
      });
    } finally {
      router.push(`/ideas?zone=${encodeURIComponent(zoneName)}`);
    }
  }

  return (
    <button
      type="button"
      onClick={exploreZone}
      disabled={loading}
      className="inline-flex max-w-full touch-manipulation items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition hover:border-primary hover:bg-accent hover:text-primary disabled:opacity-60"
    >
      <span className="truncate">{zoneName}</span>
      {loading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
      ) : (
        <ArrowRight className="h-4 w-4 shrink-0" />
      )}
    </button>
  );
}
