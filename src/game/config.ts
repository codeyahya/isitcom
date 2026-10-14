import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import { BootScene } from '../scenes/BootScene';
import { MenuScene } from '../scenes/MenuScene';     // <--- VÉRIFIEZ CET IMPORT
import { ExteriorScene } from '../scenes/ExteriorScene';
import { HallwayScene } from '../scenes/HallwayScene';
import { ServiceScene } from '../scenes/ServiceScene';
import { UIScene } from '../scenes/UIScene';
import { DevTileBrowserScene } from '../scenes/DevTileBrowserScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  // MenuScene DOIT impérativement figurer dans ce tableau :
  scene: [BootScene, MenuScene, ExteriorScene, HallwayScene, ServiceScene, UIScene, DevTileBrowserScene]
};