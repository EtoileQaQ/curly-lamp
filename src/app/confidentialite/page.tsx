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
      La protection des données personnelles de nos utilisateurs est une priorité pour Echo. 
      Nous nous engageons à respecter votre vie privée et à garantir la sécurité de vos informations. 
      Notre politique de confidentialité repose sur deux principes fondamentaux :
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement est Kenzo S.,
        joignable à <a href="mailto:contact@echo.fr">contact@echo.fr</a>.
      </p>

      <h2>2. Données que nous collectons</h2>

      <h3>2.1 - Bases légales pour le traitement des données</h3>
      <ul>
        <p>
        Nous collectons, utilisons et partageons les informations dans le respect 
        de la réglementation en vigueur et des principes de protection de la vie privée. 
        Les données sont utilisées pour fournir nos services de community management, 
        conformément aux engagements pris envers nos clients.
        </>

        <h3>2.1 - Utilisation des données</h3>
        <p>Les données collectées sont utilisées pour les finalités suivantes :</p>
        <li>
        Gestion des comptes clients et des campagnes de communication sur LinkedIn.
        </li>
        <li>
        Analyse de l&apos;efficacité des campagnes et des publications.
        </li>
        <li>
        Amélioration continue de nos services et adaptation aux besoins spécifiques de nos clients.
        </li>
      </ul>

      <h2>3. Partage des informations</h2>
      <p>
      Nous ne partageons pas les données personnelles de nos utilisateurs avec des tiers sans leur consentement. 
      Les informations collectées sont utilisées exclusivement pour la fourniture de nos services de community management.
      </p>
      <p>
      L&apos;Utilisateur doit être cependant vigilant concernant les données qu&apos;il transmet, en particulier celles à caractère sensible. 
      L&apos;Entreprise informe les utilisateurs qu&apos;elle décline toute responsabilité en ce qui concerne les données sensibles pouvant être publié sur LinkedIn.
      </p>

      <h2>4. Sécurité des données</h2>
      <p>
        Echo prend des mesures de sécurité techniques et organisationnelles appropriées pour protéger les données personnelles de nos utilisateurs contre 
        tout accès non autorisé, toute divulgation, toute altération ou toute destruction.
      </p>
      <p>
      Les données collectées sont stockées sur des datacenters situés en Europe, garantissant une protection et une conformité aux normes de sécurité élevées.
      </p>
      <p>
      De plus, toutes les données sont transmises de manière chiffrée grâce aux protocoles de chiffrement classiques tels que HTTPS. 
      Les protocoles SSL et TLS assurent une connexion sécurisée entre l&apos;application mobile et nos serveurs, garantissant ainsi que vos 
      informations restent confidentielles et intègres pendant toute la transmission.
      </p>
      <h2>5. Droits des utilisateurs</h2>
      <p>
      Tout utilisateur concerné par le traitement de ses données personnelles peut se prévaloir des droits suivants, en application du règlement 
      européen 2016/679 et de la Loi Informatique et Liberté (Loi 78-17 du 6 janvier 1978) :
      </p>
      <ul>
        <li>
        Droit d&apos;accès, de rectification et droit à l&apos;effacement des données (posés respectivement aux articles 15, 16 et 17 du RGPD) ;
        </li>
        <li>
        Droit de limitation du traitement des données (posé respectivement à l&apos;article 18 du RGPD) ;
        </li>
        <li>
        Droit de portabilité des données (posé respectivement à l&apos;article 20 du RGPD) ;
        </li>
        <li>
        Droit d&apos;opposition au traitement des données (posé respectivement à l&apos;article 21 du RGPD) ;
        </li>
        <li>
        Droit de saisir l&apos;autorité de contrôle compétente (article 77 du RGPD).
        </li>
        <li>
        Droit de déterminer le sort des données après la mort ;
        </li>
        <li>
        Droit de ne pas faire l&apos;objet d&apos;une décision fondée exclusivement sur un procédé automatisé ;
        </li>
      </ul>
      <p>
      En vertu du Règlement général sur la protection des données ou de toute autre législation applicable, 
      vous avez le droit de consulter, de rectifier, de transférer et d&apos;effacer vos informations. 
      Vous pouvez également limiter le traitement de vos informations ou vous y opposer.
      </p>
      <p>
      Pour cela, il faut effectuer la demande par courrier à l&apos;Entreprise
      , 2 rue Alfred Kastler - 44300 Nantes, ou par mail à <a href="mailto:contact@echo.fr">contact@echo.fr</a>.
      </p>
      <p>
      Afin que le responsable du traitement des données puisse faire droit à votre demande, 
      ous pouvez être tenu de lui communiquer certaines informations telles que : vos noms et prénoms et votre adresse e-mail.
      </p>

      <h2>6. Cession, changement de contrôle et transfert</h2>
      <p>
      La totalité de nos droits et obligations dans le cadre de notre Politique de confidentialité
       est librement transférable par nous à toute société affiliée dans le cadre d&apos;une fusion, 
       d&apos;une acquisition, d&apos;une restructuration ou d&apos;une vente d&apos;actifs, d&apos;une demande des t
       ribunaux ou dans d'autres cas, et nous pouvons transférer vos informations à nos sociétés 
       affiliées, successeurs ou nouveaux propriétaires.
      </p>

      <h2>7. Conditions de modification de la politique de confidentialite</h2>
      <p>
      L&apos;Entreprise se réserve le droit de pouvoir modifier la présente Politique 
      à tout moment afin d&apos;assurer aux Utilisateurs sa conformité avec le droit en vigueur.
      </p>
      <p>
      L&apos;Utilisateur est invité à prendre connaissance de cette Politique à 
      chaque fois qu&apos;il utilise nos services, sans qu&apos;il soit nécessaire de l&apos;en prévenir formellement.
      </p>

    </LegalShell>
  );
}
