"use client";

import { useEffect } from "react";

// global-error remplace tout le layout racine en cas d'erreur grave.
// Il doit donc inclure ses propres balises <html> et <body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: "system-ui, sans-serif",
          background: "#f8f8f8",
          color: "#111",
          textAlign: "center",
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 500 }}>
          Une erreur critique est survenue
        </h1>
        <p style={{ color: "#666", maxWidth: 420 }}>
          L&apos;application a rencontré un problème inattendu. Réessaie de
          recharger la page.
        </p>
        <button
          onClick={reset}
          style={{
            background: "#6c63ff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Recharger
        </button>
      </body>
    </html>
  );
}
