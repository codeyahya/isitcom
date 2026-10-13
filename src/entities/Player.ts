import Phaser from 'phaser';
import { Direction } from '../game/types';
import { PLAYER_SPEED } from '../game/constants';
import { SoundSystem } from '../systems/SoundSystem';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private targetPosition: Phaser.Math.Vector2 | null = null;
  private currentDirection: Direction = 'down';
  private stepTimer: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player_sheet');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Hitbox alignée sur les pieds pour des collisions naturelles
    this.setSize(18, 14);
    this.setOffset(3, 18);
    this.setCollideWorldBounds(true);
    this.createAnimations();
  }

  private createAnimations() {
    const anims = this.scene.anims;
    const dirs: { key: Direction; row: number }[] = [
      { key: 'down', row: 0 },
      { key: 'left', row: 1 },
      { key: 'right', row: 2 },
      { key: 'up', row: 3 }
    ];

    dirs.forEach(({ key, row }) => {
      if (!anims.exists(`player_walk_${key}`)) {
        anims.create({
          key: `player_walk_${key}`,
          frames: [
            { key: 'player_sheet', frame: row * 3 + 1 },
            { key: 'player_sheet', frame: row * 3 + 0 },
            { key: 'player_sheet', frame: row * 3 + 2 }
          ],
          frameRate: 8,
          repeat: -1
        });
      }
      if (!anims.exists(`player_idle_${key}`)) {
        anims.create({
          key: `player_idle_${key}`,
          frames: [{ key: 'player_sheet', frame: row * 3 }],
          frameRate: 1
        });
      }
    });
  }

  public setMoveTarget(x: number, y: number) {
    this.targetPosition = new Phaser.Math.Vector2(x, y);
  }

  public clearMoveTarget() {
    this.targetPosition = null;
  }

  public update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, wasdKeys: { [key: string]: Phaser.Input.Keyboard.Key }) {
    let vx = 0;
    let vy = 0;

    const left = cursors.left.isDown || wasdKeys.A.isDown || wasdKeys.Q.isDown;
    const right = cursors.right.isDown || wasdKeys.D.isDown;
    const up = cursors.up.isDown || wasdKeys.W.isDown || wasdKeys.Z.isDown;
    const down = cursors.down.isDown || wasdKeys.S.isDown;

    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    // Si le clavier est utilisé, annuler la destination souris
    if (vx !== 0 || vy !== 0) {
      this.targetPosition = null;
      const speedVec = new Phaser.Math.Vector2(vx, vy).normalize().scale(PLAYER_SPEED);
      this.setVelocity(speedVec.x, speedVec.y);
    } else if (this.targetPosition) {
      // Déplacement vers la destination souris
      const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetPosition.x, this.targetPosition.y);
      if (dist < 6) {
        this.targetPosition = null;
        this.setVelocity(0, 0);
      } else {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPosition.x, this.targetPosition.y);
        this.setVelocity(Math.cos(angle) * PLAYER_SPEED, Math.sin(angle) * PLAYER_SPEED);
      }
    } else {
      this.setVelocity(0, 0);
    }

    // Mise à jour de l'orientation et des animations
    const bodyVel = this.body?.velocity;
    if (bodyVel && (bodyVel.x !== 0 || bodyVel.y !== 0)) {
      if (Math.abs(bodyVel.x) > Math.abs(bodyVel.y)) {
        this.currentDirection = bodyVel.x > 0 ? 'right' : 'left';
      } else {
        this.currentDirection = bodyVel.y > 0 ? 'down' : 'up';
      }
      this.play(`player_walk_${this.currentDirection}`, true);

      // Bruit de pas rétro espacé
      this.stepTimer += 1;
      if (this.stepTimer > 20) {
        SoundSystem.getInstance().playStep();
        this.stepTimer = 0;
      }
    } else {
      this.play(`player_idle_${this.currentDirection}`, true);
      this.stepTimer = 0;
    }
  }

  public getFacingDirection(): Direction {
    return this.currentDirection;
  }
}