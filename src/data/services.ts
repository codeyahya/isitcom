import { ServiceRoomConfig } from '../game/types';

export const SERVICES: Record<string, ServiceRoomConfig> = {
  'service_etudiant': {
    id: 'service_etudiant',
    name: 'Service Étudiant',
    shortName: 'Vie Étudiante',
    npcName: 'Mme Ben Salem',
    npcRole: 'Responsable Vie Étudiante & Clubs',
    dialogueId: 'service_etudiant',
    missionId: 'visiter_etudiant',
    signText: 'Bureau 101 - Service Étudiant',
    themeColor: 0x10b981
  },
  'service_administratif': {
    id: 'service_administratif',
    name: 'Service Administratif',
    shortName: 'Administration & Scolarité',
    npcName: 'M. Mansour',
    npcRole: 'Chef de Scolarité',
    dialogueId: 'service_administratif',
    missionId: 'visiter_administratif',
    signText: 'Bureau 102 - Service Administratif',
    themeColor: 0x3b82f6
  },
  'service_pedagogique': {
    id: 'service_pedagogique',
    name: 'Service Pédagogique',
    shortName: 'Départements & Emplois du temps',
    npcName: 'Dr. Karoui',
    npcRole: 'Directeur des Études',
    dialogueId: 'service_pedagogique',
    missionId: 'visiter_pedagogique',
    signText: 'Bureau 103 - Service Pédagogique',
    themeColor: 0x8b5cf6
  },
  'service_technique': {
    id: 'service_technique',
    name: 'Service Technique',
    shortName: 'Support Réseaux & IT',
    npcName: 'Ing. Slim',
    npcRole: 'Administrateur Systèmes & Labs',
    dialogueId: 'service_technique',
    missionId: 'visiter_technique',
    signText: 'Bureau 104 - Service Technique',
    themeColor: 0xf59e0b
  }
};