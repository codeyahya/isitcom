import Phaser from 'phaser';

export class NPC extends Phaser.Physics.Arcade.Sprite {
  public npcId: string;
  public npcName: string;
  public dialogueId: string;
  public promptText: Phaser.GameObjects.Text | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, npcId: string, npcName: string, dialogueId: string) {
    super(scene, x, y, texture);
    this.npcId = npcId;
    this.npcName = npcName;
    this.dialogueId = dialogueId;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Statique

    this.setSize(20, 24);
    this.setOffset(2, 8);

    // Étiquette discrète au-dessus du PNJ
    const label = scene.add.text(x, y - 26, npcName, {
      fontSize: '11px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5);

    // Clignotement subtil
    scene.tweens.add({
      targets: label,
      y: y - 29,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}