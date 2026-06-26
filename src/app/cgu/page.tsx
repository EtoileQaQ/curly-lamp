import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "CGU / CGV — Echo",
  description:
    "Conditions générales d'utilisation et de vente du service Echo.",
};

export default function CguPage() {
  return (
    <LegalShell
      title="Conditions générales d'utilisation et de vente"
      updated="23 juin 2026"
    >
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales régissent l&apos;utilisation du
        service <strong>Echo</strong> (le « Service »), édité par Delphes Int.
        En créant un compte, tu acceptes ces conditions sans réserve.
      </p>

      <h2>2. Description du service</h2>
      <p>
        Echo est un outil d&apos;aide à la rédaction de posts LinkedIn assisté
        par intelligence artificielle. Il propose des idées, rédige des contenus
        dans ton style, génère des visuels et organise tes publications. Echo ne
        publie pas automatiquement sur LinkedIn : tu restes maître de tes
        publications.
      </p>

      <h2>3. Compte</h2>
      <p>
        Tu es responsable de l&apos;exactitude des informations fournies et de la
        confidentialité de tes identifiants. Tu t&apos;engages à ne pas partager
        ton compte.
      </p>

      <h2>4. Offres et tarifs</h2>
      <ul>
        <li>
          <strong>Gratuit</strong> — 0 €/mois : fonctionnalités limitées (essai).
        </li>
        <li>
          <strong>Pro</strong> — 19 €/mois : fonctionnalités complètes.
        </li>
      </ul>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises. L&apos;éditeur
        se réserve le droit de modifier ses tarifs ; les changements ne
        s&apos;appliquent qu&apos;aux périodes d&apos;abonnement à venir.
      </p>

      <h2>5. Paiement, renouvellement et résiliation</h2>
      <p>
        Les abonnements payants sont reconductibles automatiquement à chaque
        période. Tu peux résilier à tout moment depuis ton compte ; la
        résiliation prend effet à la fin de la période en cours. Une{" "}
        <strong>garantie satisfait ou remboursé de 30 jours</strong>{" "}
        s&apos;applique au premier paiement.
      </p>

      <h2>6. Utilisation acceptable</h2>
      <p>Tu t&apos;engages à ne pas utiliser le Service pour :</p>
      <ul>
        <li>diffuser des contenus illégaux, haineux, diffamatoires ou trompeurs ;</li>
        <li>usurper l&apos;identité d&apos;un tiers ;</li>
        <li>contourner les limites techniques ou de sécurité du Service.</li>
      </ul>

      <h2>7. Propriété des contenus générés</h2>
      <p>
        Les posts que tu génères avec Echo t&apos;appartiennent. Tu es libre de
        les modifier, les publier et les exploiter. Tu restes responsable des
        contenus que tu publies.
      </p>

      <h2>8. Rôle de l&apos;IA et responsabilité</h2>
      <p>
        Les contenus sont générés automatiquement et peuvent contenir des
        imprécisions. Il t&apos;appartient de les <strong>relire et vérifier</strong>{" "}
        avant publication. Le Service est fourni « en l&apos;état » ; l&apos;éditeur
        ne saurait être tenu responsable des conséquences d&apos;une publication.
      </p>

      <h2>9. Disponibilité</h2>
      <p>
        Nous faisons notre possible pour assurer la disponibilité du Service,
        sans garantie d&apos;absence d&apos;interruption (maintenance, incidents
        techniques, dépendances tierces).
      </p>

      <h2>10. Données personnelles</h2>
      <p>
        Le traitement de tes données est détaillé dans notre{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>11. Droit applicable</h2>
      <p>
        Les présentes conditions sont soumises au droit français. En cas de
        litige, une solution amiable sera recherchée avant toute action
        judiciaire, auprès des tribunaux compétents de Nantes.
      </p>

      <h2>12. Contact</h2>
      <p>
        Pour toute question :{" "}
        <a href="mailto:contact@echo.fr">contact@echo.fr</a>.
      </p>
    </LegalShell>
  );
}
