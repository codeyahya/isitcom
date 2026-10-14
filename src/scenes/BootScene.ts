import Phaser from 'phaser';
import { SHEETS, CHARACTERS, LOOSE_ASSETS } from '../data/art';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {
    const { width, height } = this.cameras.main;
    this.add.text(width / 2, height / 2, 'Chargement du campus ISITCOM...', {
      fontSize: '15px', color: '#ffffff'
    }).setOrigin(0.5);

    for (const s of Object.values(SHEETS)) {
      this.load.spritesheet(s.key, s.url, { frameWidth: 16, frameHeight: 16 });
    }
    for (const [key, url] of Object.entries(CHARACTERS)) {
      this.load.spritesheet(key, url, { frameWidth: 32, frameHeight: 32 });
    }
    this.load.image('campus_grass_loose', LOOSE_ASSETS.campusGrass);
    this.load.image('campus_path_loose', LOOSE_ASSETS.campusPath);
  }

  create() {
    if (window.location.hash === '#tiles') {
      this.scene.start('DevTileBrowserScene');
    } else {
      this.scene.start('MenuScene');
    }
  }
}