import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { SCALED_TILE, TILE_SCALE } from '../game/constants';
import { URBAN, URBAN_VARIANTS } from '../data/art';
import { SoundSystem } from '../systems/SoundSystem';

export class ExteriorScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private npcs: NPC[] = [];

  constructor() { super('ExteriorScene'); }

  private put(x: number, y: number, tile: { key: string; frame: number }) {
    return this.add.image(x * SCALED_TILE + 16, y * SCALED_TILE + 16, tile.key, tile.frame).setScale(TILE_SCALE);
  }

  private putLoose(x: number, y: number, key: string) {
    return this.add.image(x * SCALED_TILE + 16, y * SCALED_TILE + 16, key).setScale(TILE_SCALE);
  }

  create(data?: { spawnX?: number; spawnY?: number }) {
    this.scene.get('UIScene').events.emit('set_zone_name', 'ISITCOM — Esplanade Extérieure');
    const obstacles = this.physics.add.staticGroup();

    // 1. Pelouse + allées pavées : motifs en damier et bordures lisibles.
    for (let x = 0; x < 25; x++) {
      for (let y = 0; y < 19; y++) {
        const isRoad = y >= 17;
        const isPath = !isRoad && ((x >= 11 && x <= 13 && y >= 6) || (x >= 3 && x <= 21 && y >= 14 && y <= 15));
        const isFlower = !isPath && ((x === 2 && y === 8) || (x === 22 && y === 9) || (x === 5 && y === 12) || (x === 19 && y === 12));
        if (isRoad) {
          this.put(x, y, y === 17 && x % 3 === 1 ? URBAN.ROAD_MARK : URBAN.ROAD);
        } else {
          const variants = isPath ? URBAN_VARIANTS.PATH : URBAN_VARIANTS.GRASS;
          this.put(x, y, isFlower ? URBAN.GRASS_FLOWER : variants[(x * 3 + y) % variants.length]);
        }
      }
    }
    for (const [x, y] of [[1, 7], [23, 7], [1, 13], [23, 13]] as [number, number][]) {
      this.putLoose(x, y, 'campus_grass_loose');
    }

    // 2. Façade de l'ISITCOM (ligne de toit + murs) et porte vitrée
    for (let x = 3; x <= 21; x++) {
      this.put(x, 1, URBAN_VARIANTS.ROOF[x % URBAN_VARIANTS.ROOF.length]);
      for (let y = 2; y <= 4; y++) {
        const wallTile = y === 3 && x % 4 === 0 ? URBAN_VARIANTS.WINDOWS[x % URBAN_VARIANTS.WINDOWS.length] : URBAN_VARIANTS.WALL[(x + y) % URBAN_VARIANTS.WALL.length];
        const wall = obstacles.create(x * SCALED_TILE + 16, y * SCALED_TILE + 16, wallTile.key, wallTile.frame);
        wall.setScale(TILE_SCALE).refreshBody();
      }
      if (x === 11 || x === 12 || x === 13) {
        this.put(x, 5, URBAN.DOOR_GLASS);
      } else {
        const wallTile = URBAN_VARIANTS.WALL[x % URBAN_VARIANTS.WALL.length];
        const wall = obstacles.create(x * SCALED_TILE + 16, 5 * SCALED_TILE + 16, wallTile.key, wallTile.frame);
        wall.setScale(TILE_SCALE).refreshBody();
      }
    }

    // Haies le long de la façade
    for (const x of [4, 7, 16, 20]) {
      const hedge = obstacles.create(x * SCALED_TILE + 16, 6 * SCALED_TILE + 16, URBAN.HEDGE.key, URBAN.HEDGE.frame);
      hedge.setScale(TILE_SCALE).refreshBody();
    }

    // Enseigne
    const sign = this.add.rectangle(400, 34, 360, 26, 0x1d4ed8).setStrokeStyle(2, 0xf59e0b);
    this.add.text(400, 34, 'ISITCOM — UNIVERSITÉ DE SOUSSE', { fontSize: '13px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

    // 3. Végétation & mobilier urbain (positions fixes)
    const trees: [number, number, number][] = [
      [80, 300, URBAN.TREE_GREEN.frame], [180, 350, URBAN.TREE_ORANGE.frame],
      [620, 300, URBAN.TREE_ORANGE.frame], [720, 350, URBAN.TREE_GREEN.frame],
      [100, 480, URBAN.TREE_GREEN.frame], [700, 480, URBAN.TREE_ORANGE.frame]
    ];
    trees.forEach(([px, py, frame]) => {
      const t = obstacles.create(px, py, URBAN.TREE_GREEN.key, frame);
      t.setScale(TILE_SCALE).setSize(24, 24).setOffset(4, 8).refreshBody();
    });

    for (const [px, py] of [[250, 480], [550, 480]] as [number, number][]) {
      const b = obstacles.create(px, py, URBAN.BENCH.key, URBAN.BENCH.frame);
      b.setScale(TILE_SCALE).setSize(28, 16).setOffset(2, 8).refreshBody();
    }
    for (const [px, py] of [[150, 250], [650, 250]] as [number, number][]) {
      const l = obstacles.create(px, py, URBAN.LAMP.key, URBAN.LAMP.frame);
      l.setScale(TILE_SCALE).setSize(10, 10).setOffset(3, 3).refreshBody();
    }

    // Central courtyard fountain, four hedge gardens, and reference-style amenities.
    this.put(12, 10, URBAN.FOUNTAIN);
    for (const [x, y] of [[10, 9], [14, 9], [10, 12], [14, 12]] as [number, number][]) {
      const hedge = obstacles.create(x * SCALED_TILE + 16, y * SCALED_TILE + 16, URBAN.HEDGE.key, URBAN.HEDGE.frame);
      hedge.setScale(TILE_SCALE).refreshBody();
    }
    for (const [x, y] of [[4, 8], [20, 8], [4, 12], [20, 12]] as [number, number][]) {
      const board = obstacles.create(x * SCALED_TILE + 16, y * SCALED_TILE + 16, URBAN.BULLETIN.key, URBAN.BULLETIN.frame);
      board.setScale(TILE_SCALE).setSize(24, 18).setOffset(4, 8).refreshBody();
    }
    for (const [x, y] of [[8, 10], [16, 10], [8, 13], [16, 13]] as [number, number][]) {
      const bench = obstacles.create(x * SCALED_TILE + 16, y * SCALED_TILE + 16, URBAN.BENCH.key, URBAN.BENCH.frame);
      bench.setScale(TILE_SCALE).setSize(28, 16).setOffset(2, 8).refreshBody();
    }
    for (const x of [1, 23]) {
      const wall = obstacles.create(x * SCALED_TILE + 16, 16 * SCALED_TILE + 16, URBAN.WALL_EXT.key, URBAN.WALL_EXT.frame);
      wall.setScale(TILE_SCALE).refreshBody();
    }
    for (const x of [10, 11, 12, 13, 14]) this.put(x, 16, URBAN.GATE);
    this.add.text(400, 112, 'CAMPUS CENTRAL — COUR D’HONNEUR', {
      fontSize: '12px', color: '#ffffff', backgroundColor: '#17345ddd',
      padding: { x: 8, y: 4 }, fontStyle: 'bold'
    }).setOrigin(0.5);

    // 4. PNJ étudiant (sprite PIPOYA uniforme 1)
    const student = new NPC(this, 320, 320, 'yassine_sheet', 'etudiant_ext', 'Yassine (L3)', 'welcome_student');
    this.npcs.push(student);

    // 5. Joueur
    this.player = new Player(this, data?.spawnX ?? 400, data?.spawnY ?? 520);
    this.physics.add.collider(this.player, obstacles);
    this.npcs.forEach(npc => this.physics.add.collider(this.player, npc));

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
        } else this.player.setMoveTarget(clickedNPC.x, clickedNPC.y + 24);
      } else this.player.setMoveTarget(pointer.worldX, pointer.worldY);
    });
  }

  update() {
    this.player.update(this.cursors, this.wasdKeys);
    let nearNPC: NPC | null = null;
    for (const npc of this.npcs) {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y) < 50) { nearNPC = npc; break; }
    }
    const nearEntrance = Phaser.Math.Distance.Between(this.player.x, this.player.y, 400, 180) < 40;
    const ui = this.scene.get('UIScene');

    if (nearNPC) {
      ui.events.emit('show_prompt', `Appuyez sur [E] ou Clic pour parler à ${nearNPC.npcName}`);
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.enterKey)) this.interactWithNPC(nearNPC);
    } else if (nearEntrance) {
      ui.events.emit('show_prompt', 'Appuyez sur [E] pour ENTRER dans l\'ISITCOM');
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.enterKey) || this.player.y < 175) this.enterBuilding();
    } else ui.events.emit('hide_prompt');
  }

  private interactWithNPC(npc: NPC) {
    this.player.setVelocity(0, 0); this.player.clearMoveTarget();
    this.scene.get('UIScene').events.emit('show_dialogue', npc.dialogueId);
  }
  private enterBuilding() {
    SoundSystem.getInstance().playDoor();
    this.scene.get('UIScene').events.emit('mission_trigger', 'entrer_batiment');
    this.scene.start('HallwayScene', { spawnX: 400, spawnY: 530 });
  }
  public pausePlayerMovement() { this.player.setVelocity(0, 0); this.player.clearMoveTarget(); }
  public resumePlayerMovement() {}
}