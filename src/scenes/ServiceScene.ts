import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { SERVICES } from '../data/services';
import { ServiceRoomConfig } from '../game/types';
import { TILES, SCALED_TILE, TILE_SCALE } from '../game/constants';
import { SoundSystem } from '../systems/SoundSystem';

export class ServiceScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private staffNPC!: NPC;
  private serviceConfig!: ServiceRoomConfig;

  constructor() {
    super('ServiceScene');
  }

  init(data: { serviceId: string }) {
    this.serviceConfig = SERVICES[data.serviceId] || SERVICES['service_etudiant'];
  }

  create() {
    this.scene.get('UIScene').events.emit('set_zone_name', `ISITCOM — ${this.serviceConfig.name}`);
    this.scene.get('UIScene').events.emit('mission_trigger', this.serviceConfig.missionId);

    const walls = this.physics.add.staticGroup();

    // 1. Sol du bureau
    for (let x = 0; x < 25; x++) {
      for (let y = 0; y < 19; y++) {
        const floor = this.add.image(x * SCALED_TILE + 16, y * SCALED_TILE + 16, 'kenney_sheet', TILES.FLOOR_SERVICE);
        floor.setScale(TILE_SCALE);
      }
    }

    // 2. Murs de la pièce
    for (let x = 4; x < 21; x++) {
      const topW = walls.create(x * SCALED_TILE + 16, 4 * SCALED_TILE + 16, 'kenney_sheet', TILES.WALL_INT);
      topW.setScale(TILE_SCALE).refreshBody();

      if (x !== 12) {
        const botW = walls.create(x * SCALED_TILE + 16, 15 * SCALED_TILE + 16, 'kenney_sheet', TILES.WALL_INT);
        botW.setScale(TILE_SCALE).refreshBody();
      }
    }
    for (let y = 4; y < 16; y++) {
      const leftW = walls.create(4 * SCALED_TILE + 16, y * SCALED_TILE + 16, 'kenney_sheet', TILES.WALL_INT);
      leftW.setScale(TILE_SCALE).refreshBody();
      const rightW = walls.create(20 * SCALED_TILE + 16, y * SCALED_TILE + 16, 'kenney_sheet', TILES.WALL_INT);
      rightW.setScale(TILE_SCALE).refreshBody();
    }

    // Porte de sortie au Sud
    const exitDoor = this.add.image(12 * SCALED_TILE + 16, 15 * SCALED_TILE + 16, 'kenney_sheet', TILES.DOOR_OFFICE);
    exitDoor.setScale(TILE_SCALE);

    // 3. Mobilier Kenney : Bureau, chaises et étagères de dossiers
    const desk = walls.create(400, 270, 'kenney_sheet', TILES.DESK);
    desk.setScale(TILE_SCALE).setSize(32, 24).refreshBody();

    const pc = this.add.image(400, 260, 'kenney_sheet', TILES.COMPUTER);
    pc.setScale(TILE_SCALE);

    const shelf1 = walls.create(200, 180, 'kenney_sheet', TILES.BOOKSHELF);
    shelf1.setScale(TILE_SCALE).refreshBody();
    const shelf2 = walls.create(600, 180, 'kenney_sheet', TILES.BOOKSHELF);
    shelf2.setScale(TILE_SCALE).refreshBody();

    // Plaque murale du bureau
    const banner = this.add.rectangle(400, 160, 320, 26, this.serviceConfig.themeColor);
    banner.setStrokeStyle(2, 0xffffff);
    this.add.text(400, 160, this.serviceConfig.signText, {
      fontSize: '13px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 4. PNJ Responsable
    this.staffNPC = new NPC(
      this,
      400,
      230,
      'player_sheet',
      this.serviceConfig.npcName,
      this.serviceConfig.npcName,
      this.serviceConfig.dialogueId
    );

    // Joueur
    this.player = new Player(this, 400, 440);

    this.physics.add.collider(this.player, walls);
    this.physics.add.collider(this.player, this.staffNPC);

    // Contrôles
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys('W,A,S,D,Z,Q') as { [key: string]: Phaser.Input.Keyboard.Key };
      this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
  }

  update() {
    this.player.update(this.cursors, this.wasdKeys);

    const ui = this.scene.get('UIScene');
    const distToStaff = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.staffNPC.x, this.staffNPC.y);
    const nearExit = this.player.y > 470 && Math.abs(this.player.x - 400) < 30;

    if (distToStaff < 65) {
      ui.events.emit('show_prompt', `Appuyez sur [E] pour parler à ${this.serviceConfig.npcName}`);
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        this.interactWithStaff();
      }
    } else if (nearExit) {
      ui.events.emit('show_prompt', 'Sortir vers le couloir');
      if (this.player.y > 485) {
        this.exitToHallway();
      }
    } else {
      ui.events.emit('hide_prompt');
    }
  }

  private interactWithStaff() {
    this.player.setVelocity(0, 0);
    this.player.clearMoveTarget();
    this.scene.get('UIScene').events.emit('show_dialogue', this.serviceConfig.dialogueId);
  }

  private exitToHallway() {
    SoundSystem.getInstance().playDoor();
    let spawnY = 240;
    if (this.serviceConfig.id === 'service_etudiant') spawnY = 120;
    else if (this.serviceConfig.id === 'service_administratif') spawnY = 240;
    else if (this.serviceConfig.id === 'service_pedagogique') spawnY = 360;
    else if (this.serviceConfig.id === 'service_technique') spawnY = 480;

    this.scene.start('HallwayScene', { spawnX: 250, spawnY });
  }

  public pausePlayerMovement() {
    this.player.setVelocity(0, 0);
    this.player.clearMoveTarget();
  }

  public resumePlayerMovement() {}
}