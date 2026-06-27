"use client";

import { useEffect, useRef, useState } from "react";

export function StreamingPost({
  idea,
  persona,
  onComplete,
}: {
  idea: string;
  persona: string;
  onComplete: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    let fullText = "";
    completedRef.current = false;
    setText("");
    setError(null);

    async function run() {
      try {
        const response = await fetch("/api/onboarding/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea, persona }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error("La génération a échoué.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            const line = event
              .split("\n")
              .find((item) => item.startsWith("data: "));
            if (!line) continue;

            const payload = JSON.parse(line.slice(6)) as
              | { type: "delta"; text: string }
              | { type: "done" }
              | { type: "error"; message: string };

            if (payload.type === "delta") {
              fullText += payload.text;
              setText(fullText);
            }

            if (payload.type === "error") {
              throw new Error(payload.message);
            }

            if (payload.type === "done" && !completedRef.current) {
              completedRef.current = true;
              onComplete(fullText.trim());
            }
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue pendant la génération."
        );
      }
    }

    run();

    return () => controller.abort();
  }, [idea, persona, onComplete, retryKey]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p>Une erreur est survenue — réessayer</p>
        <button
          type="button"
          onClick={() => setRetryKey((key) => key + 1)}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      {!text && (
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#6c63ff]">
          Echo rédige
          <span className="inline-flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6c63ff]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6c63ff] [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6c63ff] [animation-delay:240ms]" />
          </span>
        </div>
      )}
      <div className="min-h-[220px] whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-[#12101f]">
        {text || " "}
      </div>
    </div>
  );
}
