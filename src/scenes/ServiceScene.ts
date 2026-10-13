import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { SERVICES } from '../data/services';
import { ServiceRoomConfig } from '../game/types';
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
    this.scene.get('UIScene').events.emit('set_zone_name', `ISITCOM - ${this.serviceConfig.name}`);
    this.scene.get('UIScene').events.emit('mission_trigger', this.serviceConfig.missionId);

    // Sol de la pièce
    for (let x = 0; x < 25; x++) {
      for (let y = 0; y < 19; y++) {
        this.add.image(x * 32 + 16, y * 32 + 16, 'tile_indoor_floor');
      }
    }

    const walls = this.physics.add.staticGroup();

    // Murs périphériques
    for (let x = 4; x < 21; x++) {
      const topW = walls.create(x * 32 + 16, 4 * 32 + 16, 'tile_wall');
      topW.refreshBody();
      if (x !== 12) {
        const botW = walls.create(x * 32 + 16, 15 * 32 + 16, 'tile_wall');
        botW.refreshBody();
      }
    }
    for (let y = 4; y < 16; y++) {
      const leftW = walls.create(4 * 32 + 16, y * 32 + 16, 'tile_wall');
      leftW.refreshBody();
      const rightW = walls.create(20 * 32 + 16, y * 32 + 16, 'tile_wall');
      rightW.refreshBody();
    }

    // Porte de sortie au sud
    this.add.image(12 * 32 + 16, 15 * 32 + 16, 'obj_door');

    // Mobilier : Comptoir / Bureau
    const desk = walls.create(400, 280, 'obj_desk');
    desk.refreshBody();

    this.add.image(390, 270, 'obj_pc');
    this.add.image(420, 272, 'obj_sign');

    // Panneau mural spécifique au service
    const banner = this.add.rectangle(400, 160, 320, 28, this.serviceConfig.themeColor);
    banner.setStrokeStyle(2, 0xffffff);
    this.add.text(400, 160, this.serviceConfig.signText, {
      fontSize: '13px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // PNJ Responsable du service
    const npcSheet = this.serviceConfig.id === 'service_technique' ? 'npc_tech_sheet' : 'npc_staff_sheet';
    this.staffNPC = new NPC(
      this,
      400,
      240,
      npcSheet,
      this.serviceConfig.npcName,
      this.serviceConfig.npcName,
      this.serviceConfig.dialogueId
    );

    // Joueur (entre par la porte sud)
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

    // Clic souris
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const distToNPC = Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, this.staffNPC.x, this.staffNPC.y);
      if (distToNPC < 32) {
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.staffNPC.x, this.staffNPC.y) < 65) {
          this.interactWithStaff();
        } else {
          this.player.setMoveTarget(this.staffNPC.x, this.staffNPC.y + 40);
        }
      } else {
        this.player.setMoveTarget(pointer.worldX, pointer.worldY);
      }
    });
  }

  update() {
    this.player.update(this.cursors, this.wasdKeys);

    const ui = this.scene.get('UIScene');
    const distToStaff = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.staffNPC.x, this.staffNPC.y);
    const nearExit = this.player.y > 470 && Math.abs(this.player.x - 400) < 30;

    if (distToStaff < 65) {
      ui.events.emit('show_prompt', `Appuyez sur [E] ou Clic pour parler à ${this.serviceConfig.npcName}`);
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
    // Le joueur revient dans le couloir à proximité de la porte du service visité
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