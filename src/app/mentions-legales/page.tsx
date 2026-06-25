import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Mentions légales — Echo",
  description:
    "Mentions légales du site Echo, SaaS de génération de posts LinkedIn.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalShell title="Mentions légales" updated="24 juin 2026">
      <div className="rounded-2xl border border-[#e5e5e5] bg-[#f8f8f8] p-5">
        <h2 className="!mt-0">Sommaire</h2>
        <ul>
          <li>
            <a href="#editeur">Éditeur du site</a>
          </li>
          <li>
            <a href="#hebergement">Hébergement</a>
          </li>
          <li>
            <a href="#service">Description du service</a>
          </li>
          <li>
            <a href="#propriete-intellectuelle">Propriété intellectuelle</a>
          </li>
          <li>
            <a href="#donnees-personnelles">Données personnelles</a>
          </li>
          <li>
            <a href="#cookies">Cookies</a>
          </li>
          <li>
            <a href="#responsabilite">Responsabilité</a>
          </li>
          <li>
            <a href="#droit-applicable">Droit applicable</a>
          </li>
        </ul>
      </div>

      <h2 id="editeur">1. Éditeur du site</h2>
      <p>
        Le site et le service <strong>Echo</strong> sont édités par :
      </p>
      <ul>
        <li>Raison sociale : Delphes Int</li>
        <li>Forme juridique : auto-entreprise</li>
        <li>
          Adresse : 144 rue Paul Bellamy, CS 12417, 44024 Nantes Cedex 1,
          France
        </li>
        <li>
          Adresse e-mail :{" "}
          <a href="mailto:support@delphes-int.fr">support@delphes-int.fr</a>
        </li>
        <li>Directeur de la publication : Delphes Int</li>
        <li>
          Responsable du traitement des données personnelles : Delphes Int
        </li>
      </ul>
      <p>
        Si certaines informations légales (SIRET, numéro de TVA, immatriculation)
        sont applicables à l&apos;éditeur, elles doivent être communiquées sur
        demande ou ajoutées à cette page dès leur disponibilité.
      </p>

      <h2 id="hebergement">2. Hébergement</h2>
      <p>Le site est hébergé par :</p>
      <ul>
        <li>Vercel Inc.</li>
        <li>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
        <li>
          Site : <a href="https://vercel.com">vercel.com</a>
        </li>
      </ul>
      <p>
        Les données de l&apos;application sont stockées via Supabase (base de
        données PostgreSQL). Le service utilise également des prestataires
        techniques nécessaires à son fonctionnement, notamment Clerk
        (authentification), Stripe (paiements) et Anthropic (génération de
        texte). Le détail figure dans notre{" "}
        <a href="/confidentialite">politique de confidentialité</a> pour le
        détail des sous-traitants.
      </p>

      <h2 id="service">3. Description du service</h2>
      <p>
        Echo est un service en ligne permettant aux utilisateurs de générer des
        idées de posts LinkedIn, de rédiger des publications dans leur style,
        d&apos;analyser leur potentiel de lecture, de transformer des contenus
        existants en posts et de créer des visuels adaptés à LinkedIn.
      </p>
      <p>
        L&apos;accès à certaines fonctionnalités peut être soumis à la création
        d&apos;un compte, à une limite d&apos;usage ou à la souscription d&apos;un
        abonnement payant. Les informations relatives aux tarifs, à la
        résiliation et aux conditions commerciales sont précisées dans les{" "}
        <a href="/cgu">conditions générales d&apos;utilisation et de vente</a>.
      </p>

      <h2 id="propriete-intellectuelle">4. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des éléments du site (marque, logo, textes, interface,
        code) est protégé par le droit de la propriété intellectuelle et reste
        la propriété exclusive de l&apos;éditeur, sauf mention contraire. Toute
        reproduction ou réutilisation sans autorisation préalable est interdite.
      </p>
      <p>
        Les contenus que tu génères avec Echo (tes posts) t&apos;appartiennent —
        voir nos <a href="/cgu">conditions générales</a>.
      </p>

      <h2 id="donnees-personnelles">5. Données personnelles</h2>
      <p>
        Le traitement de tes données personnelles est décrit dans notre{" "}
        <a href="/confidentialite">politique de confidentialité</a>. Tu disposes
        de droits d&apos;accès, de rectification et de suppression que tu peux
        exercer à l&apos;adresse{" "}
        <a href="mailto:support@delphes-int.fr">support@delphes-int.fr</a>.
      </p>
      <p>
        Les principales données traitées dans le cadre du service sont les
        informations de compte, les éléments fournis lors de l&apos;onboarding,
        les contenus générés ou enregistrés, les informations de facturation
        traitées par Stripe et les données techniques nécessaires à la sécurité
        et au bon fonctionnement du service.
      </p>
      <p>
        Conformément au RGPD, tu peux exercer tes droits d&apos;accès, de
        rectification, d&apos;effacement, d&apos;opposition, de limitation et de
        portabilité. Tu peux également introduire une réclamation auprès de la{" "}
        <a href="https://www.cnil.fr/fr/plaintes">CNIL</a>.
      </p>

      <h2 id="cookies">6. Cookies</h2>
      <p>
        Le site utilise des cookies strictement nécessaires à son
        fonctionnement, notamment pour maintenir la session utilisateur,
        sécuriser l&apos;authentification et permettre le paiement des
        abonnements.
      </p>
      <p>
        Echo ne dépose pas de cookies publicitaires sans consentement préalable.
        Tu peux configurer ton navigateur pour refuser certains cookies, mais
        cela peut empêcher l&apos;accès à tout ou partie du service.
      </p>

      <h2 id="responsabilite">7. Responsabilité</h2>
      <p>
        Echo fournit une assistance à la création de contenus LinkedIn au moyen
        de technologies d&apos;intelligence artificielle. Les résultats générés
        peuvent nécessiter une relecture, une correction ou une adaptation par
        l&apos;utilisateur avant publication.
      </p>
      <p>
        L&apos;éditeur ne peut garantir que les contenus générés soient exempts
        d&apos;erreurs, parfaitement adaptés à chaque situation ou conformes à
        toutes les règles applicables à l&apos;activité de l&apos;utilisateur. Il
        appartient à l&apos;utilisateur de vérifier les informations avant toute
        publication.
      </p>
      <p>
        L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;accès au service, mais
        ne peut garantir une disponibilité permanente, notamment en cas de
        maintenance, d&apos;incident technique, de panne d&apos;un prestataire ou
        de force majeure.
      </p>

      <h2 id="droit-applicable">8. Droit applicable</h2>
      <p>
        Les présentes mentions légales sont soumises au droit français. En cas
        de litige, les parties s&apos;efforceront de rechercher une solution
        amiable avant toute action judiciaire.
      </p>

      <h2>9. Contact</h2>
      <p>
        Pour toute question relative à ces mentions légales ou au service Echo,
        tu peux écrire à{" "}
        <a href="mailto:support@delphes-int.fr">support@delphes-int.fr</a>.
      </p>
    </LegalShell>
  );
}
