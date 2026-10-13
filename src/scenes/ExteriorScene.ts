import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { SoundSystem } from '../systems/SoundSystem';

export class ExteriorScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private npcs: NPC[] = [];
  private entranceZone!: Phaser.GameObjects.Zone;

  constructor() {
    super('ExteriorScene');
  }

  create(data?: { spawnX?: number; spawnY?: number }) {
    this.scene.get('UIScene').events.emit('set_zone_name', 'ISITCOM - Esplanade Extérieure');

    // 1. Fond extérieur : Pelouse et allées
    for (let x = 0; x < 25; x++) {
      for (let y = 0; y < 19; y++) {
        this.add.image(x * 32 + 16, y * 32 + 16, 'tile_grass');
      }
    }

    // Allée centrale vers l'entrée
    for (let x = 10; x <= 14; x++) {
      for (let y = 7; y < 19; y++) {
        this.add.image(x * 32 + 16, y * 32 + 16, 'tile_path');
      }
    }

    // Allée horizontale
    for (let x = 3; x < 22; x++) {
      for (let y = 14; y <= 15; y++) {
        this.add.image(x * 32 + 16, y * 32 + 16, 'tile_path');
      }
    }

    // 2. Bâtiment principal ISITCOM Sousse
    const obstacles = this.physics.add.staticGroup();

    // Murs de la façade
    for (let x = 2; x < 23; x++) {
      for (let y = 1; y < 7; y++) {
        if (y === 6 && (x === 11 || x === 12 || x === 13)) {
          // Entrée principale
          this.add.image(x * 32 + 16, y * 32 + 16, 'obj_door');
        } else {
          const wall = obstacles.create(x * 32 + 16, y * 32 + 16, 'tile_wall');
          wall.refreshBody();
        }
      }
    }

    // Enseigne universitaire sur la façade
    const signBoard = this.add.rectangle(400, 80, 360, 34, 0x1d4ed8);
    signBoard.setStrokeStyle(2, 0xf59e0b);
    this.add.text(400, 80, 'ISITCOM - UNIVERSITÉ DE SOUSSE', {
      fontSize: '15px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Végétation et bancs
    const treePositions = [
      { x: 90, y: 320 }, { x: 170, y: 360 }, { x: 630, y: 320 }, { x: 710, y: 360 },
      { x: 100, y: 480 }, { x: 700, y: 480 }
    ];
    treePositions.forEach(pos => {
      const tree = obstacles.create(pos.x, pos.y, 'obj_tree');
      tree.setSize(24, 20).setOffset(12, 44);
      tree.refreshBody();
    });

    const bench1 = obstacles.create(250, 480, 'obj_bench');
    bench1.refreshBody();
    const bench2 = obstacles.create(550, 480, 'obj_bench');
    bench2.refreshBody();

    // 3. PNJ étudiant extérieur
    const student = new NPC(this, 320, 320, 'npc_student_sheet', 'etudiant_ext', 'Yassine (L3)', 'welcome_student');
    this.npcs.push(student);

    // 4. Joueur
    const startX = data?.spawnX ?? 400;
    const startY = data?.spawnY ?? 520;
    this.player = new Player(this, startX, startY);

    this.physics.add.collider(this.player, obstacles);
    this.npcs.forEach(npc => this.physics.add.collider(this.player, npc));

    // 5. Zone de transition : Entrée principale vers le couloir
    this.entranceZone = this.add.zone(400, 200, 80, 20);
    this.physics.add.existing(this.entranceZone, true);

    // 6. Contrôles
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys('W,A,S,D,Z,Q') as { [key: string]: Phaser.Input.Keyboard.Key };
      this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    // Gestion du clic de souris pour déplacement ou interaction
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        const clickedNPC = this.npcs.find(npc => {
          return Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, npc.x, npc.y) < 30;
        });

        if (clickedNPC) {
          const distToPlayer = Phaser.Math.Distance.Between(this.player.x, this.player.y, clickedNPC.x, clickedNPC.y);
          if (distToPlayer < 60) {
            this.interactWithNPC(clickedNPC);
          } else {
            this.player.setMoveTarget(clickedNPC.x, clickedNPC.y + 24);
          }
        } else {
          this.player.setMoveTarget(pointer.worldX, pointer.worldY);
        }
      }
    });

    this.cameras.main.setBounds(0, 0, 800, 600);
  }

  update() {
    this.player.update(this.cursors, this.wasdKeys);

    // Vérification de l'interaction avec le PNJ
    let nearNPC: NPC | null = null;
    for (const npc of this.npcs) {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y) < 50) {
        nearNPC = npc;
        break;
      }
    }

    // Détection d'entrée dans le bâtiment
    const nearEntrance = Phaser.Math.Distance.Between(this.player.x, this.player.y, 400, 210) < 40;

    const ui = this.scene.get('UIScene');
    if (nearNPC) {
      ui.events.emit('show_prompt', `Appuyez sur [E] ou Clic pour parler à ${nearNPC.npcName}`);
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        this.interactWithNPC(nearNPC);
      }
    } else if (nearEntrance) {
      ui.events.emit('show_prompt', 'Appuyez sur [E] ou avancez pour ENTRER dans l\'ISITCOM');
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.enterKey) || this.player.y < 210) {
        this.enterBuilding();
      }
    } else {
      ui.events.emit('hide_prompt');
    }
  }

  private interactWithNPC(npc: NPC) {
    this.player.setVelocity(0, 0);
    this.player.clearMoveTarget();
    this.scene.get('UIScene').events.emit('show_dialogue', npc.dialogueId);
  }

  private enterBuilding() {
    SoundSystem.getInstance().playDoor();
    this.scene.get('UIScene').events.emit('mission_trigger', 'entrer_batiment');
    this.scene.start('HallwayScene', { spawnX: 400, spawnY: 530 });
  }

  public pausePlayerMovement() {
    this.player.setVelocity(0, 0);
    this.player.clearMoveTarget();
  }

  public resumePlayerMovement() {}
}