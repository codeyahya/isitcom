import { MissionStep } from '../game/types';

export const INITIAL_MISSIONS: MissionStep[] = [
  {
    id: 'parler_etudiant',
    title: '1. Parler à un étudiant dehors',
    description: 'Parle avec l\'étudiant sur l\'esplanade extérieure pour prendre des repères.',
    hint: 'Approche-toi de Yassine devant les arbres et appuie sur [E] ou clique sur lui.',
    completed: false
  },
  {
    id: 'entrer_batiment',
    title: '2. Entrer dans l\'ISITCOM',
    description: 'Franchis la porte principale du bâtiment universitaire.',
    hint: 'Dirige-toi vers les portes centrales sous l\'enseigne ISITCOM.',
    completed: false
  },
  {
    id: 'visiter_etudiant',
    title: '3. Visiter le Service Étudiant',
    description: 'Trouve la porte du Service Étudiant dans le couloir intérieur.',
    hint: 'C\'est la 1ère porte sur ta gauche dans le couloir.',
    completed: false
  },
  {
    id: 'parler_resp_etudiant',
    title: '4. Parler au Service Étudiant',
    description: 'Dialogue avec la responsable du Service Étudiant.',
    hint: 'Parle à Mme Ben Salem au guichet.',
    completed: false
  },
  {
    id: 'visiter_administratif',
    title: '5. Visiter le Service Administratif',
    description: 'Rends-toi au Service Administratif et consulte le personnel.',
    hint: 'C\'est la 2ème porte sur ta gauche dans le couloir.',
    completed: false
  },
  {
    id: 'visiter_pedagogique',
    title: '6. Visiter le Service Pédagogique',
    description: 'Découvre le Service Pédagogique concernant les cours et plannings.',
    hint: 'C\'est la 3ème porte sur ta gauche dans le couloir.',
    completed: false
  },
  {
    id: 'visiter_technique',
    title: '7. Visiter le Service Technique',
    description: 'Rapproche-toi du support technique pour configurer tes accès.',
    hint: 'C\'est la 4ème porte sur ta gauche au bout du couloir.',
    completed: false
  },
  {
    id: 'quete_terminee',
    title: '8. Exploration terminée !',
    description: 'Tu as découvert tous les services indispensables de l\'ISITCOM Sousse.',
    hint: 'Tu peux explorer librement le campus à tout moment !',
    completed: false
  }
];