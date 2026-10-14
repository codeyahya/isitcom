import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { SERVICES } from '../data/services';
import { ServiceRoomConfig } from '../game/types';
import { ROOM, ROOM_FLOORS, ROOM_WALLS, FURN, FURN_VARIANTS, SERVICE_FLOOR } from '../data/art';
import { SCALED_TILE, TILE_SCALE } from '../game/constants';
import { SoundSystem } from '../systems/SoundSystem';

export class ServiceScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private staffNPC!: NPC;
  private serviceConfig!: ServiceRoomConfig;

  constructor() { super('ServiceScene'); }

  init(data: { serviceId: string }) {
    this.serviceConfig = SERVICES[data.serviceId] || SERVICES['service_etudiant'];
  }

  private put(x: number, y: number, t: { key: string; frame: number }, group?: Phaser.Physics.Arcade.StaticGroup) {
    const img = group
      ? group.create(x * SCALED_TILE + 16, y * SCALED_TILE + 16, t.key, t.frame)
      : this.add.image(x * SCALED_TILE + 16, y * SCALED_TILE + 16, t.key, t.frame);
    img.setScale(TILE_SCALE);
    if (group) (img as Phaser.Physics.Arcade.Image).refreshBody();
    return img;
  }

  private buildServiceLayout(walls: Phaser.Physics.Arcade.StaticGroup) {
    const id = this.serviceConfig.id;
    const place = (x: number, y: number, tile: { key: string; frame: number }, solid = false) => {
      this.put(x, y, tile, solid ? walls : undefined);
    };

    place(12, 8, FURN.DESK, true);
    place(13, 8, FURN.DESK_SIDE, true);
    place(12, 7, FURN_VARIANTS.SCREENS[0]);
    place(14, 9, FURN_VARIANTS.CHAIRS[0]);
    place(19, 5, FURN.CLOCK);
    place(5, 14, FURN_VARIANTS.PLANTS[0]);

    if (id === 'service_administratif') {
      place(7, 5, FURN_VARIANTS.STORAGE[0], true);
      place(8, 5, FURN_VARIANTS.STORAGE[1], true);
      place(17, 5, FURN_VARIANTS.PAPERWORK[0], true);
      place(17, 12, FURN_VARIANTS.PAPERWORK[1], true);
      place(6, 11, FURN.SOFA, true);
      place(7, 11, FURN.CHAIR);
    } else if (id === 'service_etudiant') {
      place(6, 6, FURN.COUNTER, true);
      place(7, 6, FURN.COUNTER, true);
      place(6, 7, FURN.CHAIR);
      place(17, 6, FURN_VARIANTS.PLANTS[1]);
      place(18, 6, FURN_VARIANTS.PLANTS[0]);
      place(16, 12, FURN.SOFA, true);
      place(17, 12, FURN.SOFA, true);
    } else if (id === 'service_pedagogique') {
      place(7, 5, FURN.BOARD, true);
      place(8, 5, FURN.BOARD, true);
      place(16, 5, FURN_VARIANTS.STORAGE[0], true);
      place(17, 5, FURN_VARIANTS.STORAGE[1], true);
      place(7, 12, FURN.DESK, true);
      place(8, 12, FURN.DESK_SIDE, true);
      place(7, 11, FURN_VARIANTS.SCREENS[1]);
      place(9, 12, FURN_VARIANTS.CHAIRS[1]);
      for (const [x, y] of [[11, 6], [14, 6], [11, 9], [14, 9]] as [number, number][]) {
        place(x, y, FURN_VARIANTS.DESKS[(x + y) % FURN_VARIANTS.DESKS.length], true);
        place(x, y + 1, FURN_VARIANTS.CHAIRS[(x + y) % FURN_VARIANTS.CHAIRS.length]);
      }
    } else {
      place(6, 5, FURN_VARIANTS.SCREENS[1], true);
      place(7, 5, FURN_VARIANTS.SCREENS[2], true);
      place(16, 5, FURN_VARIANTS.STORAGE[0], true);
      place(17, 5, FURN_VARIANTS.STORAGE[1], true);
      place(17, 12, FURN_VARIANTS.PAPERWORK[1], true);
      place(18, 12, FURN.COOLER, true);
    }
  }

  create() {
    this.scene.get('UIScene').events.emit('set_zone_name', `ISITCOM — ${this.serviceConfig.name}`);
    this.scene.get('UIScene').events.emit('mission_trigger', this.serviceConfig.missionId);
    const walls = this.physics.add.staticGroup();
    const floor = SERVICE_FLOOR[this.serviceConfig.id] ?? ROOM.FLOOR_WOOD;

    // 1. Sol spécifique au service, avec une alternance discrète qui évite le motif en bande.
    for (let x = 0; x < 25; x++) {
      for (let y = 0; y < 19; y++) {
        const tile = (x + y) % 5 === 0 ? ROOM_FLOORS[1] : floor;
        this.put(x, y, tile);
      }
    }

    // Institute-style room blocks: a calmer carpeted work zone, a tiled
    // circulation lane, and a distinct reception/classroom landing.
    for (let x = 5; x <= 19; x++) {
      this.put(x, 9, ROOM.FLOOR_TILE);
      this.put(x, 10, ROOM_FLOORS[1]);
    }
    for (let x = 8; x <= 16; x++) {
      this.put(x, 6, ROOM.FLOOR_WOOD);
      this.put(x, 7, ROOM.FLOOR_WOOD);
    }
    for (const x of [10, 11, 12, 13, 14]) {
      this.put(x, 13, this.serviceConfig.id === 'service_pedagogique' ? ROOM.FLOOR_TILE : ROOM.FLOOR_CARPET);
    }

    // 2. Murs de la pièce avec plinthes
    for (let x = 4; x < 21; x++) {
      this.put(x, 4, ROOM_WALLS[x % ROOM_WALLS.length], walls);
      if (x % 5 === 0) this.put(x, 4, ROOM.WINDOW);
      if (x !== 12) this.put(x, 15, ROOM_WALLS[(x + 1) % ROOM_WALLS.length], walls);
    }
    for (let y = 4; y < 16; y++) {
      this.put(4, y, ROOM_WALLS[y % ROOM_WALLS.length], walls);
      this.put(20, y, ROOM_WALLS[(y + 1) % ROOM_WALLS.length], walls);
    }
    this.put(12, 15, ROOM.DOOR); // porte de sortie au Sud

    this.buildServiceLayout(walls);

    // Plaque murale
    const banner = this.add.rectangle(400, 160, 320, 26, this.serviceConfig.themeColor).setStrokeStyle(2, 0xffffff);
    this.add.text(400, 160, this.serviceConfig.signText, {
      fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    // 4. PNJ Responsable — sprite dédié par service
    const sheetByService: Record<string, string> = {
      service_etudiant: 'staff_etudiant_sheet',
      service_administratif: 'staff_admin_sheet',
      service_pedagogique: 'staff_pedago_sheet',
      service_technique: 'staff_tech_sheet'
    };
    this.staffNPC = new NPC(this, 448, 300, sheetByService[this.serviceConfig.id] ?? 'staff_etudiant_sheet',
      this.serviceConfig.npcName, this.serviceConfig.npcName, this.serviceConfig.dialogueId);

    this.player = new Player(this, 400, 440);
    this.physics.add.collider(this.player, walls);
    this.physics.add.collider(this.player, this.staffNPC);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys('W,A,S,D,Z,Q') as { [key: string]: Phaser.Input.Keyboard.Key };
      this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, this.staffNPC.x, this.staffNPC.y) < 35) {
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.staffNPC.x, this.staffNPC.y) < 60) {
          this.interactWithStaff();
        } else {
          this.player.setMoveTarget(this.staffNPC.x, this.staffNPC.y + 24);
        }
        return;
      }
      this.player.setMoveTarget(pointer.worldX, pointer.worldY);
    });
  }

  update() {
    this.player.update(this.cursors, this.wasdKeys);
    const nearExit = this.player.y > 460 && Math.abs(this.player.x - 400) < 45;
    const nearStaff = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.staffNPC.x, this.staffNPC.y) < 55;
    const ui = this.scene.get('UIScene');
    if (nearStaff) {
      ui.events.emit('show_prompt', `Appuyez sur [E] ou cliquez pour parler à ${this.staffNPC.npcName}`);
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        this.interactWithStaff();
      }
    } else if (nearExit) {
      ui.events.emit('show_prompt', 'Appuyez sur [E] pour retourner au couloir');
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.enterKey) || this.player.y > 475) this.exitToHallway();
    } else ui.events.emit('hide_prompt');
  }

  private exitToHallway() {
    SoundSystem.getInstance().playDoor();
    this.scene.start('HallwayScene', { spawnX: 400, spawnY: 540 });
  }
  private interactWithStaff() {
    this.player.setVelocity(0, 0);
    this.player.clearMoveTarget();
    this.scene.get('UIScene').events.emit('show_dialogue', this.staffNPC.dialogueId);
  }
  public pausePlayerMovement() { this.player.setVelocity(0, 0); this.player.clearMoveTarget(); }
  public resumePlayerMovement() {}
}