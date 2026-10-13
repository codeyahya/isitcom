import { DialogueData } from '../game/types';

export const DIALOGUES: Record<string, DialogueData> = {
  welcome_student: {
    id: 'welcome_student',
    lines: [
      {
        speaker: 'Yassine (Étudiant en L3)',
        text: 'Bienvenue à l\'ISITCOM de Sousse ! Tu découvres le campus aujourd\'hui ?'
      },
      {
        speaker: 'Yassine (Étudiant en L3)',
        text: 'Entre par la grande porte du bâtiment principal. Tu trouveras les 4 services clés dans le couloir à gauche !'
      },
      {
        speaker: 'Yassine (Étudiant en L3)',
        text: 'Commence d\'abord par le Service Étudiant pour valider ton arrivée. Bon courage !'
      }
    ]
  },
  hallway_guide: {
    id: 'hallway_guide',
    lines: [
      {
        speaker: 'Sarra (Déléguée de promo)',
        text: 'Salut ! Dans ce couloir, tous les bureaux administratifs et pédagogiques sont situés sur ta GAUCHE.'
      },
      {
        speaker: 'Sarra (Déléguée de promo)',
        text: 'Chaque porte possède une plaque descriptive : Étudiant, Administratif, Pédagogique et Technique.'
      }
    ]
  },
  service_etudiant: {
    id: 'service_etudiant',
    lines: [
      {
        speaker: 'Mme Ben Salem (Service Étudiant)',
        text: 'Bonjour et bienvenue au Service Étudiant de l\'ISITCOM !'
      },
      {
        speaker: 'Mme Ben Salem (Service Étudiant)',
        text: 'Ici, nous gérons la vie associative, les cartes d\'étudiant, les attestations de présence et les bourses.'
      },
      {
        speaker: 'Mme Ben Salem (Service Étudiant)',
        text: 'N\'hésite pas à rejoindre les clubs de robotique et de développement web ! Rends-toi maintenant au Service Administratif.'
      }
    ]
  },
  service_administratif: {
    id: 'service_administratif',
    lines: [
      {
        speaker: 'M. Mansour (Service Administratif)',
        text: 'Bonjour. Vous êtes au Service Administratif et de la scolarité.'
      },
      {
        speaker: 'M. Mansour (Service Administratif)',
        text: 'Nous traitons les dossiers d\'inscription, le dépôt des pièces justificatives et les relevés de notes officiels.'
      },
      {
        speaker: 'M. Mansour (Service Administratif)',
        text: 'Tout est en ordre pour ton dossier d\'orientation ! Passe voir le Service Pédagogique.'
      }
    ]
  },
  service_pedagogique: {
    id: 'service_pedagogique',
    lines: [
      {
        speaker: 'Dr. Karoui (Service Pédagogique)',
        text: 'Bonjour jeune collègue. Bienvenue au Service Pédagogique.'
      },
      {
        speaker: 'Dr. Karoui (Service Pédagogique)',
        text: 'Nous coordonnons les départements d\'Informatique et de Télécommunications, les emplois du temps et les stages de PFE.'
      },
      {
        speaker: 'Dr. Karoui (Service Pédagogique)',
        text: 'Pour clore ta tournée, va signaler ton compte réseau auprès du Service Technique.'
      }
    ]
  },
  service_technique: {
    id: 'service_technique',
    lines: [
      {
        speaker: 'Ing. Slim (Service Technique)',
        text: 'Salut ! Bienvenue au support informatique et réseaux de l\'institut.'
      },
      {
        speaker: 'Ing. Slim (Service Technique)',
        text: 'Ici nous configurons vos identifiants Wi-Fi campus, l\'accès à l\'ENT et la maintenance des laboratoires de TP.'
      },
      {
        speaker: 'Ing. Slim (Service Technique)',
        text: 'Félicitations ! Tes accès sont activés et tu as visité l\'ensemble des 4 services d\'ISITCOM Sousse !'
      }
    ]
  }
};