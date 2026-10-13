import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const { width, height } = this.cameras.main;

    const loadingText = this.add.text(width / 2, height / 2, 'Chargement des graphismes Kenney...', {
      fontSize: '15px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 1. Découpage automatique de la spritesheet Kenney
    this.load.spritesheet('kenney_sheet', 'assets/tiles/roguelikeSheet_transparent.png', {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 1
    });

    // 2. Spritesheet du joueur (32x32)
    this.load.spritesheet('player_sheet', 'assets/characters/player.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.scene.start('MenuScene');
  }
}