import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { SERVICES } from '../data/services';
import { ROOM, ROOM_FLOORS, ROOM_WALLS, FURN, FURN_VARIANTS, URBAN } from '../data/art';
import { SCALED_TILE, TILE_SCALE } from '../game/constants';
import { SoundSystem } from '../systems/SoundSystem';

export class HallwayScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private npcs: NPC[] = [];
  private doors: { serviceId: string; x: number; y: number; name: string }[] = [];

  constructor() { super('HallwayScene'); }

  private put(x: number, y: number, t: { key: string; frame: number }, group?: Phaser.Physics.Arcade.StaticGroup) {
    const img = group
      ? group.create(x * SCALED_TILE + 16, y * SCALED_TILE + 16, t.key, t.frame)
      : this.add.image(x * SCALED_TILE + 16, y * SCALED_TILE + 16, t.key, t.frame);
    img.setScale(TILE_SCALE);
    if (group) (img as Phaser.Physics.Arcade.Image).refreshBody();
    return img;
  }

  create(data?: { spawnX?: number; spawnY?: number }) {
    this.scene.get('UIScene').events.emit('set_zone_name', 'ISITCOM — Couloir des Services');
    const walls = this.physics.add.staticGroup();

    // Four-room overview matching the reference plan: two offices on each side
    // of a generous central corridor.
    for (let x = 0; x < 25; x++) {
      for (let y = 0; y < 19; y++) {
        const floor = x >= 11 && x <= 13
          ? ROOM_FLOORS[(x + y) % 2]
          : ROOM_FLOORS[(x + y * 2) % ROOM_FLOORS.length];
        this.put(x, y, floor);
      }
    }

    // Outer shell, double-thick room dividers, and central corridor openings.
    for (let x = 0; x < 25; x++) {
      this.put(x, 0, ROOM_WALLS[x % ROOM_WALLS.length], walls);
      this.put(x, 18, ROOM_WALLS[(x + 1) % ROOM_WALLS.length], walls);
    }
    for (let y = 1; y < 18; y++) {
      this.put(0, y, ROOM_WALLS[y % ROOM_WALLS.length], walls);
      this.put(24, y, ROOM_WALLS[(y + 1) % ROOM_WALLS.length], walls);
    }
    for (const x of [10, 14]) {
      for (let y = 1; y < 18; y++) {
        if (y !== 5 && y !== 12) {
          this.put(x, y, ROOM_WALLS[(x + y) % ROOM_WALLS.length], walls);
          this.put(x + (x === 10 ? -1 : 1), y, ROOM_WALLS[(x + y + 1) % ROOM_WALLS.length], walls);
        }
      }
    }
    for (const y of [9]) {
      for (let x = 1; x < 24; x++) {
        if (x < 10 || x > 14) {
          this.put(x, y, ROOM_WALLS[(x + y) % ROOM_WALLS.length], walls);
          this.put(x, y + 1, ROOM_WALLS[(x + y + 1) % ROOM_WALLS.length], walls);
        }
      }
    }
    for (const x of [5, 19]) this.put(x, 0, ROOM.WINDOW);

    // The four reference-aligned doors.
    this.doors = [
      { serviceId: 'service_administratif', x: 336, y: 176, name: SERVICES['service_administratif'].name },
      { serviceId: 'service_pedagogique', x: 464, y: 176, name: SERVICES['service_pedagogique'].name },
      { serviceId: 'service_etudiant', x: 336, y: 400, name: SERVICES['service_etudiant'].name },
      { serviceId: 'service_technique', x: 464, y: 400, name: SERVICES['service_technique'].name }
    ];

    this.doors.forEach(door => {
      this.add.image(door.x, door.y, ROOM.DOOR.key, ROOM.DOOR.frame).setScale(TILE_SCALE);
      this.add.rectangle(door.x, door.y - 22, 82, 4, 0xf59e0b, 0.9);
    });

    // Room-specific furniture blocks, leaving a clear path from every doorway.
    const furniture = (x: number, y: number, tile: { key: string; frame: number }, solid = false) =>
      this.put(x, y, tile, solid ? walls : undefined);
    furniture(2, 2, FURN_VARIANTS.STORAGE[0], true);
    furniture(3, 2, FURN_VARIANTS.STORAGE[1], true);
    furniture(7, 2, FURN.BOARD);
    furniture(4, 4, FURN.DESK, true);
    furniture(5, 4, FURN.DESK_SIDE, true);
    furniture(5, 5, FURN_VARIANTS.SCREENS[0]);
    furniture(7, 6, FURN_VARIANTS.PAPERWORK[0], true);
    furniture(2, 7, FURN_VARIANTS.PLANTS[0]);

    furniture(16, 2, FURN_VARIANTS.STORAGE[0], true);
    furniture(17, 2, FURN_VARIANTS.STORAGE[1], true);
    furniture(20, 2, FURN.BOARD);
    furniture(18, 4, FURN.DESK, true);
    furniture(19, 4, FURN.DESK_SIDE, true);
    furniture(19, 5, FURN_VARIANTS.SCREENS[1]);
    furniture(21, 6, FURN_VARIANTS.PLANTS[1]);

    furniture(2, 11, FURN.SHELF, true);
    furniture(3, 11, FURN.SHELF, true);
    furniture(5, 13, FURN.COUNTER, true);
    furniture(6, 13, FURN.COUNTER, true);
    furniture(6, 14, FURN.CHAIR);
    furniture(2, 16, FURN.SOFA, true);
    furniture(8, 16, FURN_VARIANTS.PLANTS[0]);

    furniture(16, 11, FURN_VARIANTS.SCREENS[1], true);
    furniture(17, 11, FURN_VARIANTS.SCREENS[2], true);
    furniture(21, 11, FURN_VARIANTS.STORAGE[0], true);
    furniture(22, 11, FURN_VARIANTS.STORAGE[1], true);
    furniture(18, 14, FURN.DESK, true);
    furniture(19, 14, FURN.DESK_SIDE, true);
    furniture(19, 15, FURN_VARIANTS.PAPERWORK[0]);
    furniture(22, 16, FURN.COOLER, true);

    // Corridor landmarks and soft overhead lighting.
    furniture(12, 3, FURN_VARIANTS.PLANTS[0]);
    furniture(12, 8, FURN_VARIANTS.PLANTS[1]);
    furniture(12, 14, FURN_VARIANTS.PLANTS[0]);
    furniture(11, 16, URBAN.BENCH, true);
    furniture(13, 16, URBAN.BENCH, true);
    this.put(12, 2, FURN.BOARD);
    this.put(12, 10, FURN.CLOCK);
    this.add.rectangle(448, 336, 8, 120, 0xfef3c7, 0.16);
    this.add.rectangle(640, 336, 8, 120, 0xfef3c7, 0.16);
    const labels = [
      [224, 48, 'SERVICE ADMINISTRATIF'],
      [576, 48, 'SERVICE PÉDAGOGIQUE'],
      [224, 320, 'SERVICE ÉTUDIANT'],
      [576, 320, 'SERVICE TECHNIQUE']
    ] as const;
    labels.forEach(([x, y, text]) => this.add.text(x, y, text, {
      fontSize: '11px', color: '#ffffff', backgroundColor: '#17345ddd',
      padding: { x: 7, y: 4 }, fontStyle: 'bold'
    }).setOrigin(0.5));

    // PNJ Déléguée
    const guide = new NPC(this, 592, 248, 'sarra_sheet', 'sarra_guide', 'Sarra (Déléguée)', 'hallway_guide');
    this.npcs.push(guide);

    this.player = new Player(this, data?.spawnX ?? 400, data?.spawnY ?? 540);
    this.physics.add.collider(this.player, walls);
    this.npcs.forEach(npc => this.physics.add.collider(this.player, npc));

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
        } else this.player.setMoveTarget(clickedDoor.x + 36, clickedDoor.y);
        return;
      }
      const clickedNPC = this.npcs.find(npc => Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, npc.x, npc.y) < 35);
      if (clickedNPC) {
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, clickedNPC.x, clickedNPC.y) < 60) {
          this.interactWithNPC(clickedNPC);
        } else {
          this.player.setMoveTarget(clickedNPC.x, clickedNPC.y + 24);
        }
        return;
      }
      this.player.setMoveTarget(pointer.worldX, pointer.worldY);
    });
  }

  update() {
    this.player.update(this.cursors, this.wasdKeys);
    let nearDoor: { serviceId: string; x: number; y: number; name: string } | null = null;
    for (const door of this.doors) {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, door.x, door.y) < 45) { nearDoor = door; break; }
    }
    const nearExit = this.player.y > 550 && Math.abs(this.player.x - 400) < 60;
    const ui = this.scene.get('UIScene');

    if (nearDoor) {
      ui.events.emit('show_prompt', `Appuyez sur [E] pour entrer au ${nearDoor.name}`);
      const crossedDoor = nearDoor.x < 400 ? this.player.x < nearDoor.x - 24 : this.player.x > nearDoor.x + 24;
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.enterKey) || crossedDoor) {
        this.enterService(nearDoor.serviceId);
      }
    } else if (nearExit) {
      ui.events.emit('show_prompt', 'Sortir vers l\'Esplanade Extérieure');
      if (this.player.y > 570) this.exitToExterior();
    } else ui.events.emit('hide_prompt');
  }

  private enterService(serviceId: string) {
    SoundSystem.getInstance().playDoor();
    this.scene.start('ServiceScene', { serviceId });
  }
  private interactWithNPC(npc: NPC) {
    this.player.setVelocity(0, 0);
    this.player.clearMoveTarget();
    this.scene.get('UIScene').events.emit('show_dialogue', npc.dialogueId);
  }
  private exitToExterior() {
    SoundSystem.getInstance().playDoor();
    this.scene.start('ExteriorScene', { spawnX: 400, spawnY: 210 });
  }
  public pausePlayerMovement() { this.player.setVelocity(0, 0); this.player.clearMoveTarget(); }
  public resumePlayerMovement() {}
}