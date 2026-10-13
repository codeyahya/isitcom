import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { SERVICES } from '../data/services';
import { TILES, SCALED_TILE, TILE_SCALE } from '../game/constants';
import { SoundSystem } from '../systems/SoundSystem';

export class HallwayScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private npcs: NPC[] = [];
  private doors: { serviceId: string; x: number; y: number; name: string }[] = [];

  constructor() {
    super('HallwayScene');
  }

  create(data?: { spawnX?: number; spawnY?: number }) {
    this.scene.get('UIScene').events.emit('set_zone_name', 'ISITCOM — Couloir des Services');

    const walls = this.physics.add.staticGroup();

    // 1. Sol intérieur
    for (let x = 0; x < 25; x++) {
      for (let y = 0; y < 19; y++) {
        const floor = this.add.image(x * SCALED_TILE + 16, y * SCALED_TILE + 16, 'kenney_sheet', TILES.FLOOR_INDOOR);
        floor.setScale(TILE_SCALE);
      }
    }

    // 2. Murs Nord et Sud
    for (let x = 0; x < 25; x++) {
      const topWall = walls.create(x * SCALED_TILE + 16, 16, 'kenney_sheet', TILES.WALL_INT);
      topWall.setScale(TILE_SCALE);
      topWall.refreshBody();

      if (x < 11 || x > 13) {
        const bottomWall = walls.create(x * SCALED_TILE + 16, 584, 'kenney_sheet', TILES.WALL_INT);
        bottomWall.setScale(TILE_SCALE);
        bottomWall.refreshBody();
      }
    }

    // Mur droit
    for (let y = 1; y < 18; y++) {
      const rightWall = walls.create(750, y * SCALED_TILE + 16, 'kenney_sheet', TILES.WALL_INT);
      rightWall.setScale(TILE_SCALE);
      rightWall.refreshBody();
    }

    // 3. Les 4 portes des services sur le côté GAUCHE (x = 200)
    this.doors = [
      { serviceId: 'service_etudiant', x: 200, y: 120, name: SERVICES['service_etudiant'].name },
      { serviceId: 'service_administratif', x: 200, y: 240, name: SERVICES['service_administratif'].name },
      { serviceId: 'service_pedagogique', x: 200, y: 360, name: SERVICES['service_pedagogique'].name },
      { serviceId: 'service_technique', x: 200, y: 480, name: SERVICES['service_technique'].name }
    ];

    for (let y = 0; y < 19; y++) {
      const yPos = y * SCALED_TILE + 16;
      const isDoor = this.doors.some(d => Math.abs(d.y - yPos) < 20);

      if (!isDoor) {
        const leftWall = walls.create(200, yPos, 'kenney_sheet', TILES.WALL_INT);
        leftWall.setScale(TILE_SCALE);
        leftWall.refreshBody();
      }
    }

    // Rendu visuel des portes Kenney et plaques indicatives
    this.doors.forEach(door => {
      const dImg = this.add.image(door.x, door.y, 'kenney_sheet', TILES.DOOR_OFFICE);
      dImg.setScale(TILE_SCALE);

      const signImg = this.add.image(door.x + 32, door.y, 'kenney_sheet', TILES.SIGN);
      signImg.setScale(TILE_SCALE);

      this.add.text(door.x + 48, door.y - 8, door.name, {
        fontSize: '12px',
        color: '#1e3a8a',
        backgroundColor: '#ffffffdd',
        padding: { x: 4, y: 2 },
        fontStyle: 'bold'
      });
    });

    // PNJ Déléguée
    const guide = new NPC(this, 540, 280, 'player_sheet', 'sarra_guide', 'Sarra (Déléguée)', 'hallway_guide');
    this.npcs.push(guide);

    // Joueur
    const startX = data?.spawnX ?? 400;
    const startY = data?.spawnY ?? 540;
    this.player = new Player(this, startX, startY);

    this.physics.add.collider(this.player, walls);
    this.npcs.forEach(npc => this.physics.add.collider(this.player, npc));

    // Contrôles
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys('W,A,S,D,Z,Q') as { [key: string]: Phaser.Input.Keyboard.Key };
      this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const clickedDoor = this.doors.find(d => Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, d.x, d.y) < 32);
      if (clickedDoor) {
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, clickedDoor.x, clickedDoor.y) < 55) {
          this.enterService(clickedDoor.serviceId);
        } else {
          this.player.setMoveTarget(clickedDoor.x + 36, clickedDoor.y);
        }
        return;
      }
      this.player.setMoveTarget(pointer.worldX, pointer.worldY);
    });
  }

  update() {
    this.player.update(this.cursors, this.wasdKeys);

    let nearDoor: { serviceId: string; name: string } | null = null;
    for (const door of this.doors) {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, door.x, door.y) < 45) {
        nearDoor = door;
        break;
      }
    }

    const nearExit = this.player.y > 550 && Math.abs(this.player.x - 400) < 60;
    const ui = this.scene.get('UIScene');

    if (nearDoor) {
      ui.events.emit('show_prompt', `Appuyez sur [E] pour entrer au ${nearDoor.name}`);
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.enterKey) || this.player.x < 210) {
        this.enterService(nearDoor.serviceId);
      }
    } else if (nearExit) {
      ui.events.emit('show_prompt', 'Sortir vers l\'Esplanade Extérieure');
      if (this.player.y > 570) {
        this.exitToExterior();
      }
    } else {
      ui.events.emit('hide_prompt');
    }
  }

  private enterService(serviceId: string) {
    SoundSystem.getInstance().playDoor();
    this.scene.start('ServiceScene', { serviceId });
  }

  private exitToExterior() {
    SoundSystem.getInstance().playDoor();
    this.scene.start('ExteriorScene', { spawnX: 400, spawnY: 210 });
  }

  public pausePlayerMovement() {
    this.player.setVelocity(0, 0);
    this.player.clearMoveTarget();
  }

  public resumePlayerMovement() {}
}