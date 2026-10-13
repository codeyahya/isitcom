import Phaser from 'phaser';
import { AssetGenerator } from '../systems/AssetGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const { width, height } = this.cameras.main;
    const text = this.add.text(width / 2, height / 2, 'Chargement de l\'ISITCOM...', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Initialisation immédiate des textures graphiques pixel-art procédurales
    AssetGenerator.createAllTextures(this);

    this.time.delayedCall(400, () => {
      text.setText('Prêt !');
      this.scene.start('UIScene');
      this.scene.start('ExteriorScene');
    });
  }
}