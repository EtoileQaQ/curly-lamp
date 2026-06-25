import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Echo",
  description:
    "Comment Echo collecte, utilise et protège tes données personnelles (RGPD).",
};

export default function ConfidentialitePage() {
  return (
    <LegalShell title="Politique de confidentialité" updated="23 juin 2026">
      <p>
        Cette politique explique quelles données nous collectons, pourquoi, et
        quels sont tes droits. Nous nous engageons à respecter le Règlement
        Général sur la Protection des Données (RGPD).
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement est [À COMPLÉTER — nom de la société],
        joignable à <a href="mailto:contact@echo.fr">contact@echo.fr</a>.
      </p>

      <h2>2. Données que nous collectons</h2>
      <ul>
        <li>
          <strong>Données de compte</strong> : adresse e-mail et identifiants de
          connexion (gérés par notre prestataire d&apos;authentification).
        </li>
        <li>
          <strong>Données de profil</strong> : métier, cible, objectif, URL
          LinkedIn (facultative), anciens posts collés, couleurs de marque.
        </li>
        <li>
          <strong>Mémoire identitaire</strong> : convictions, anecdotes,
          positions, valeurs et expériences que tu choisis d&apos;ajouter.
        </li>
        <li>
          <strong>Contenus générés</strong> : les posts créés et leur statut.
        </li>
      </ul>

      <h2>3. Finalités</h2>
      <ul>
        <li>Te permettre de créer un compte et d&apos;accéder au service.</li>
        <li>
          Générer des posts personnalisés dans ton style et les conserver dans
          ton tableau de bord.
        </li>
        <li>Améliorer la qualité et la sécurité du service.</li>
      </ul>

      <h2>4. Base légale</h2>
      <p>
        Les traitements reposent sur l&apos;exécution du contrat (fourniture du
        service) et, le cas échéant, sur ton consentement.
      </p>

      <h2>5. Sous-traitants et destinataires</h2>
      <p>
        Pour fonctionner, Echo s&apos;appuie sur des prestataires qui peuvent
        traiter une partie de tes données, uniquement pour notre compte :
      </p>
      <ul>
        <li>
          <strong>Clerk</strong> — authentification et gestion des comptes.
        </li>
        <li>
          <strong>Supabase</strong> — hébergement de la base de données.
        </li>
        <li>
          <strong>Anthropic</strong> — génération de texte par IA (ton profil et
          tes anciens posts sont transmis pour produire le contenu).
        </li>
        <li>
          <strong>fal.ai</strong> — génération d&apos;images (si tu utilises
          cette option).
        </li>
        <li>
          <strong>Vercel</strong> — hébergement de l&apos;application.
        </li>
      </ul>
      <p>
        Nous ne vendons jamais tes données et ne les partageons pas à des fins
        publicitaires.
      </p>

      <h2>6. Transferts hors Union européenne</h2>
      <p>
        Certains prestataires sont situés hors de l&apos;UE (notamment aux
        États-Unis). Ces transferts sont encadrés par des garanties appropriées
        (clauses contractuelles types).
      </p>

      <h2>7. Durée de conservation</h2>
      <p>
        Tes données sont conservées tant que ton compte est actif. Après
        suppression de ton compte, elles sont effacées ou anonymisées dans un
        délai raisonnable, sauf obligation légale de conservation.
      </p>

      <h2>8. Tes droits</h2>
      <p>
        Conformément au RGPD, tu disposes des droits d&apos;accès, de
        rectification, d&apos;effacement, de portabilité, de limitation et
        d&apos;opposition. Pour les exercer, écris à{" "}
        <a href="mailto:contact@echo.fr">contact@echo.fr</a>. Tu peux également
        introduire une réclamation auprès de la CNIL (
        <a href="https://www.cnil.fr">cnil.fr</a>).
      </p>

      <h2>9. Cookies</h2>
      <p>
        Nous utilisons uniquement des cookies nécessaires au fonctionnement du
        service (authentification, sécurité).
      </p>

      <h2>10. Contact</h2>
      <p>
        Pour toute question sur cette politique :{" "}
        <a href="mailto:contact@echo.fr">contact@echo.fr</a>.
      </p>
    </LegalShell>
  );
}
