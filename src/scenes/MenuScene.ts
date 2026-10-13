import Phaser from 'phaser';
import { SaveSystem } from '../systems/SaveSystem';
import { SoundSystem } from '../systems/SoundSystem';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fond bleu nuit
    this.add.rectangle(width / 2, height / 2, width, height, 0x0b132b);

    // Titre
    const titleBox = this.add.rectangle(width / 2, 140, 640, 90, 0x1e293b);
    titleBox.setStrokeStyle(3, 0x3b82f6);

    this.add.text(width / 2, 120, 'CAMPUS QUEST', {
      fontSize: '30px',
      color: '#f59e0b',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 155, 'ISITCOM SOUSSE — GUIDE & ORIENTATION', {
      fontSize: '14px',
      color: '#93c5fd'
    }).setOrigin(0.5);

    // Bouton Jouer / Nouvelle partie
    this.createButton(width / 2, 270, 'Nouvelle partie', 0x2563eb, () => {
      SaveSystem.reset();
      this.scene.start('UIScene');
      this.scene.start('ExteriorScene');
    });

    // Bouton Continuer (si sauvegarde existante)
    if (SaveSystem.hasSave()) {
      this.createButton(width / 2, 330, 'Continuer la partie', 0x10b981, () => {
        this.scene.start('UIScene');
        this.scene.start('ExteriorScene');
      });
    }

    // Commandes
    this.add.text(width / 2, 450, 
      'Commandes : Flèches / ZQSD pour marcher — [E] ou Clic pour interagir', {
      fontSize: '12px',
      color: '#94a3b8'
    }).setOrigin(0.5);
  }

  private createButton(x: number, y: number, text: string, color: number, onClick: () => void) {
    const btn = this.add.container(x, y);
    const rect = this.add.rectangle(0, 0, 260, 42, color).setOrigin(0.5);
    rect.setStrokeStyle(2, 0xffffff, 0.5);

    const label = this.add.text(0, 0, text, {
      fontSize: '15px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    rect.setInteractive({ useHandCursor: true });
    rect.on('pointerdown', () => {
      SoundSystem.getInstance().playBlip();
      onClick();
    });
    rect.on('pointerover', () => rect.setScale(1.05));
    rect.on('pointerout', () => rect.setScale(1));

    btn.add([rect, label]);
  }
}