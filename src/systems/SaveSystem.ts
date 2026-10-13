import { SAVE_KEY } from '../game/constants';
import { SaveState } from '../game/types';

export class SaveSystem {
  public static getInitialState(): SaveState {
    return {
      version: 1,
      completedMissions: [],
      visitedServices: [],
      currentMissionIndex: 0,
      soundEnabled: true
    };
  }

  public static load(): SaveState {
    try {
      const data = localStorage.getItem(SAVE_KEY);
      if (!data) return this.getInitialState();
      const parsed = JSON.parse(data) as SaveState;
      if (parsed.version === 1) return parsed;
      return this.getInitialState();
    } catch (e) {
      console.warn('Erreur de lecture du localStorage, réinitialisation de la sauvegarde', e);
      return this.getInitialState();
    }
  }

  public static save(state: SaveState): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Erreur lors de la sauvegarde dans le localStorage', e);
    }
  }

  public static reset(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.warn('Erreur lors de la suppression de la sauvegarde', e);
    }
  }

  public static hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  }
}