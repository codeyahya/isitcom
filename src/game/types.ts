export type Direction = 'up' | 'down' | 'left' | 'right';

export interface DialogueLine {
  speaker: string;
  text: string;
  choices?: { text: string; nextIndex: number }[];
}

export interface DialogueData {
  id: string;
  lines: DialogueLine[];
}

export interface MissionStep {
  id: string;
  title: string;
  description: string;
  hint: string;
  completed: boolean;
}

export interface ServiceRoomConfig {
  id: string;
  name: string;
  shortName: string;
  npcName: string;
  npcRole: string;
  dialogueId: string;
  missionId: string;
  signText: string;
  themeColor: number;
}

export interface SaveState {
  version: number;
  completedMissions: string[];
  visitedServices: string[];
  currentMissionIndex: number;
  soundEnabled: boolean;
  playerPos?: { scene: string; x: number; y: number };
}