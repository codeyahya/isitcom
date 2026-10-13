import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { TILES, SCALED_TILE, TILE_SCALE } from '../game/constants';
import { SoundSystem } from '../systems/SoundSystem';

export class ExteriorScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private npcs: NPC[] = [];

  constructor() {
    super('ExteriorScene');
  }

  create(data?: { spawnX?: number; spawnY?: number }) {
    this.scene.get('UIScene').events.emit('set_zone_name', 'ISITCOM — Esplanade Extérieure');

    const obstacles = this.physics.add.staticGroup();

    // 1. Sol : Pelouse et Allée piétonne centrale
    for (let x = 0; x < 25; x++) {
      for (let y = 0; y < 19; y++) {
        const isPath = (x >= 10 && x <= 14 && y >= 6) || (x >= 3 && x <= 21 && y >= 14 && y <= 15);
        const tileIndex = isPath ? TILES.PATH : (x % 3 === 0 && y % 3 === 0 ? TILES.GRASS_FLOWERS : TILES.GRASS);
        
        const img = this.add.image(x * SCALED_TILE + 16, y * SCALED_TILE + 16, 'kenney_sheet', tileIndex);
        img.setScale(TILE_SCALE);
      }
    }

    // 2. Façade du bâtiment ISITCOM
    for (let x = 3; x <= 21; x++) {
      for (let y = 1; y <= 5; y++) {
        if (y === 5 && (x === 11 || x === 12 || x === 13)) {
          // Porte d'entrée
          const door = this.add.image(x * SCALED_TILE + 16, y * SCALED_TILE + 16, 'kenney_sheet', TILES.ENTRANCE_DOOR);
          door.setScale(TILE_SCALE);
        } else {
          // Murs du bâtiment
          const wallTile = (y === 1) ? TILES.WALL_ROOF : TILES.WALL_EXT;
          const wall = obstacles.create(x * SCALED_TILE + 16, y * SCALED_TILE + 16, 'kenney_sheet', wallTile);
          wall.setScale(TILE_SCALE);
          wall.refreshBody();
        }
      }
    }

    // Enseigne universitaire
    const sign = this.add.rectangle(400, 50, 360, 30, 0x1d4ed8);
    sign.setStrokeStyle(2, 0xf59e0b);
    this.add.text(400, 50, 'ISITCOM — UNIVERSITÉ DE SOUSSE', {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 3. Arbres et bancs
    const treeCoords = [
      { x: 80, y: 300 }, { x: 180, y: 350 }, { x: 620, y: 300 }, { x: 720, y: 350 },
      { x: 100, y: 480 }, { x: 700, y: 480 }
    ];
    treeCoords.forEach(pos => {
      const tree = obstacles.create(pos.x, pos.y, 'kenney_sheet', TILES.TREE_TOP);
      tree.setScale(TILE_SCALE);
      tree.setSize(24, 24).setOffset(4, 8);
      tree.refreshBody();
    });

    const bench1 = obstacles.create(250, 480, 'kenney_sheet', TILES.BENCH);
    bench1.setScale(TILE_SCALE);
    bench1.refreshBody();

    const bench2 = obstacles.create(550, 480, 'kenney_sheet', TILES.BENCH);
    bench2.setScale(TILE_SCALE);
    bench2.refreshBody();

    // 4. PNJ étudiant extérieur
    const student = new NPC(this, 320, 320, 'player_sheet', 'etudiant_ext', 'Yassine (L3)', 'welcome_student');
    this.npcs.push(student);

    // 5. Joueur
    const startX = data?.spawnX ?? 400;
    const startY = data?.spawnY ?? 520;
    this.player = new Player(this, startX, startY);

    this.physics.add.collider(this.player, obstacles);
    this.npcs.forEach(npc => this.physics.add.collider(this.player, npc));

    // Contrôles
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys('W,A,S,D,Z,Q') as { [key: string]: Phaser.Input.Keyboard.Key };
      this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const clickedNPC = this.npcs.find(npc => Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, npc.x, npc.y) < 35);
      if (clickedNPC) {
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, clickedNPC.x, clickedNPC.y) < 60) {
          this.interactWithNPC(clickedNPC);
        } else {
          this.player.setMoveTarget(clickedNPC.x, clickedNPC.y + 24);
        }
      } else {
        this.player.setMoveTarget(pointer.worldX, pointer.worldY);
      }
    });
  }

  update() {
    this.player.update(this.cursors, this.wasdKeys);

    let nearNPC: NPC | null = null;
    for (const npc of this.npcs) {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y) < 50) {
        nearNPC = npc;
        break;
      }
    }

    const nearEntrance = Phaser.Math.Distance.Between(this.player.x, this.player.y, 400, 180) < 40;
    const ui = this.scene.get('UIScene');

    if (nearNPC) {
      ui.events.emit('show_prompt', `Appuyez sur [E] ou Clic pour parler à ${nearNPC.npcName}`);
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        this.interactWithNPC(nearNPC);
      }
    } else if (nearEntrance) {
      ui.events.emit('show_prompt', 'Appuyez sur [E] pour ENTRER dans l\'ISITCOM');
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.enterKey) || this.player.y < 175) {
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