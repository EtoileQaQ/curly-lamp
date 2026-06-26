"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Quote, BarChart3, Type, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppHeader } from "@/components/app-header";

type Post = {
  id: string;
  title: string | null;
  content: string | null;
};

type Format = "quote" | "infographic" | "styled";

// Taille réelle du visuel (carré, idéal LinkedIn).
const CANVAS = 1080;

const FORMATS: { id: Format; label: string; icon: typeof Quote }[] = [
  { id: "quote", label: "Citation visuelle", icon: Quote },
  { id: "infographic", label: "Infographie", icon: BarChart3 },
  { id: "styled", label: "Post texte stylisé", icon: Type },
];

export function VisualStudio({
  post,
  brandPrimary,
  brandSecondary,
}: {
  post: Post;
  brandPrimary: string;
  brandSecondary: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewSize, setPreviewSize] = useState(0);

  // Valeurs de départ : le titre du post comme texte principal, les 3 premières
  // lignes du post comme points pour l'infographie.
  const defaultPoints =
    post.content
      ?.split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 3)
      .join("\n") ?? "";

  const [format, setFormat] = useState<Format>("quote");
  const [mainText, setMainText] = useState(post.title ?? "");
  const [author, setAuthor] = useState("");
  const [pointsText, setPointsText] = useState(defaultPoints);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;

    const updateSize = () => setPreviewSize(element.clientWidth);
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const points = pointsText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  async function download() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 1,
        width: CANVAS,
        height: CANVAS,
      });
      const link = document.createElement("a");
      link.download = `echo-visuel-${format}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-card pb-28 text-foreground md:pb-0">
      <AppHeader />

      <section className="mx-auto w-full max-w-5xl overflow-x-hidden p-4 md:px-6 md:py-10 lg:px-8">
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm md:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
            Studio visuel
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">
            Crée le visuel de ton post
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Choisis un format, ajuste le texte, puis télécharge ton image (carré
            1080×1080, prêt pour LinkedIn).
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-8">
          {/* Colonne de gauche : contrôles */}
          <div className="min-w-0 space-y-5 rounded-2xl border border-border bg-background p-5 shadow-sm md:space-y-6 md:p-6">
            <div>
              <Label className="mb-2 block">Format du visuel</Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {FORMATS.map((f) => {
                  const Icon = f.icon;
                  const active = format === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id)}
                      className={`flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-xl border p-3 text-center text-sm font-medium transition sm:flex-col sm:p-4 ${
                        active
                          ? "border-primary bg-primary/5 ring-2 ring-primary"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainText">
                {format === "quote"
                  ? "Citation (texte principal)"
                  : "Titre principal"}
              </Label>
              <Textarea
                id="mainText"
                value={mainText}
                onChange={(e) => setMainText(e.target.value)}
                rows={3}
              />
            </div>

            {format === "infographic" && (
              <div className="space-y-2">
                <Label htmlFor="points">Points clés (un par ligne)</Label>
                <Textarea
                  id="points"
                  value={pointsText}
                  onChange={(e) => setPointsText(e.target.value)}
                  rows={5}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="author">Ton nom / pseudo (optionnel)</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex. Marie Dupont"
              />
            </div>

            <Button
              onClick={download}
              size="lg"
              disabled={downloading}
              className="w-full sm:w-auto"
            >
              {downloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Préparation…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Télécharger le visuel
                </>
              )}
            </Button>
          </div>

          {/* Colonne de droite : aperçu */}
          <div className="min-w-0">
            <Label className="mb-2 block">Aperçu</Label>
            <div
              ref={previewRef}
              className="aspect-square w-full max-w-[460px] overflow-hidden rounded-2xl border border-border shadow-lg"
            >
              {/* Ce wrapper applique la mise à l'échelle pour l'affichage ;
                  la carte capturée (cardRef) garde sa taille réelle 1080px. */}
              <div
                style={{
                  transform: `scale(${previewSize / CANVAS})`,
                  transformOrigin: "top left",
                }}
              >
                <VisualCard
                  ref={cardRef}
                  format={format}
                  mainText={mainText}
                  author={author}
                  points={points}
                  brandPrimary={brandPrimary}
                  brandSecondary={brandSecondary}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ----- La carte réelle (1080x1080) qui sera exportée en PNG -----

const VisualCard = forwardRef<
  HTMLDivElement,
  {
    format: Format;
    mainText: string;
    author: string;
    points: string[];
    brandPrimary: string;
    brandSecondary: string;
  }
>(function VisualCard(
  { format, mainText, author, points, brandPrimary, brandSecondary },
  ref
) {
  const base: React.CSSProperties = {
    width: CANVAS,
    height: CANVAS,
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  };

  if (format === "quote") {
    return (
      <div
        ref={ref}
        style={{
          ...base,
          background: `linear-gradient(135deg, ${brandPrimary}, ${brandSecondary})`,
          color: "#ffffff",
          padding: 96,
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 180, lineHeight: 0.8, fontWeight: 800, opacity: 0.5 }}>
          &ldquo;
        </div>
        <p style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.25, marginTop: 24 }}>
          {mainText}
        </p>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 6, background: "#ffffff", borderRadius: 3 }} />
          <span style={{ fontSize: 30, fontWeight: 600 }}>
            {author || "Sur LinkedIn"}
          </span>
        </div>
      </div>
    );
  }

  if (format === "infographic") {
    return (
      <div
        ref={ref}
        style={{ ...base, background: "#ffffff", color: "#0f172a", padding: 96 }}
      >
        <div style={{ width: 120, height: 12, background: brandPrimary, borderRadius: 6 }} />
        <h2 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.15, marginTop: 40 }}>
          {mainText}
        </h2>
        <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 36 }}>
          {points.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
              <div
                style={{
                  flexShrink: 0,
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${brandPrimary}, ${brandSecondary})`,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 800,
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: 34, fontWeight: 500, lineHeight: 1.3 }}>{p}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: brandPrimary }} />
          <span style={{ fontSize: 28, fontWeight: 600, color: "#475569" }}>
            {author || "Sur LinkedIn"}
          </span>
        </div>
      </div>
    );
  }

  // format === "styled"
  return (
    <div
      ref={ref}
      style={{
        ...base,
        background: "#0f172a",
        color: "#ffffff",
        padding: 96,
        justifyContent: "center",
        borderLeft: `28px solid ${brandPrimary}`,
      }}
    >
      <span
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: brandSecondary,
        }}
      >
        À lire
      </span>
      <p style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.2, marginTop: 32 }}>
        {mainText}
      </p>
      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${brandPrimary}, ${brandSecondary})`,
          }}
        />
        <span style={{ fontSize: 30, fontWeight: 600 }}>
          {author || "Sur LinkedIn"}
        </span>
      </div>
    </div>
  );
});
