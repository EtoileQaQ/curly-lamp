"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/reveal";

export function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Pro : -20% en annuel (19€ → 15,20€/mois, facturé 182€/an).
  const pro = annual
    ? { price: "15,20€", old: "19€", note: "soit 182€ facturés par an" }
    : { price: "19€", old: "39€", note: "" };

  async function handleProCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      } else if (data.error === "Non autorisé") {
        // Pas connecté → on envoie vers sign-up avec redirection post-auth
        router.push("/sign-up?redirect=/#tarifs");
      } else {
        alert("Erreur : " + (data.error ?? "Impossible de lancer le paiement."));
      }
    } catch {
      alert("Erreur réseau. Réessaie dans quelques instants.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="tarifs" className="bg-[#12101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#b8b4ff]">
            Tarifs
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
            Teste Echo gratuitement. Passe Pro quand tu veux publier pour de vrai.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Commence sans carte bancaire, vérifie si le rendu te ressemble,
            puis débloque la génération illimitée quand Echo devient ton
            système de contenu LinkedIn.
          </p>

          {/* Toggle mensuel / annuel (fonctionnel) */}
          <div className="mt-6 inline-flex items-center gap-1 rounded-lg border border-[#2a2450] bg-[#1c1930] p-1">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                !annual ? "bg-[#6c63ff] text-white" : "text-slate-500"
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition ${
                annual ? "bg-[#6c63ff] text-white" : "text-slate-500"
              }`}
            >
              Annuel
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  annual
                    ? "bg-white/20 text-white"
                    : "bg-[#eeecff] text-[#6c63ff]"
                }`}
              >
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl items-start gap-6 md:grid-cols-2">
          {/* Carte Gratuit */}
          <Reveal>
            <div className="h-full rounded-2xl border border-[#2a2450] bg-[#1c1930] p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-lg font-semibold">Gratuit</h3>
              <div className="mt-2 text-3xl font-medium">0€/mois</div>
              <p className="mt-2 text-sm text-slate-500">
                Pour tester la qualité d&apos;Echo avec tes propres idées.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-[#6c63ff]">•</span> 4 posts pour valider le rendu
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#6c63ff]">•</span> Mémoire éditoriale incluse
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#6c63ff]">•</span> Questions guidées si l&apos;idée est trop vague
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#6c63ff]">•</span> Aucun paiement demandé
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="mt-6 block rounded-lg border border-[#2a2450] px-4 py-2.5 text-center text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Commencer gratuitement
              </Link>
            </div>
          </Reveal>

          {/* Carte Pro (featured) */}
          <Reveal delay={120}>
            <div className="relative h-full rounded-2xl border-2 border-[#6c63ff] bg-[#1c1930] p-6 shadow-lg shadow-[#6c63ff]/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#eeecff] px-3 py-1 text-xs font-bold text-[#6c63ff]">
                Le plus populaire
              </span>
              <h3 className="text-lg font-semibold">Pro</h3>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-medium">{pro.price}/mois</span>
                <span className="mb-1 text-sm text-[#999] line-through">
                  {pro.old}
                </span>
              </div>
              <p className="mt-1 h-4 text-xs text-[#6c63ff]">{pro.note}</p>
              <p className="mt-2 text-sm text-slate-500">
                Pour transformer Echo en routine de publication LinkedIn.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {[
                  "Posts illimités pour publier sans compter",
                  "Mémoire éditoriale enrichie avec ton style et tes angles",
                  "Dialogue anti-générique pour obtenir des posts plus incarnés",
                  "Score dwell time pour améliorer avant de publier",
                  "Garde-fou thématique pour éviter de tourner en rond",
                  "Repurposing pour transformer notes, articles ou transcripts",
                  "Visuels LinkedIn prêts à utiliser",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-[#6c63ff]">•</span> {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleProCheckout}
                disabled={loading}
                className="mt-6 block w-full rounded-lg bg-[#6c63ff] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Chargement…" : `Passer Pro à ${pro.price} →`}
              </button>
            </div>
          </Reveal>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Sans engagement long terme · Annulation à tout moment depuis ton compte
        </p>
      </div>
    </section>
  );
}
