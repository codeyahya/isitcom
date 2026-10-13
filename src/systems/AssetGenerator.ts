import Phaser from 'phaser';

export class AssetGenerator {
  public static createAllTextures(scene: Phaser.Scene): void {
    this.createGrassTile(scene);
    this.createPathTile(scene);
    this.createWallTile(scene);
    this.createIndoorFloorTile(scene);
    this.createTree(scene);
    this.createBench(scene);
    this.createDoor(scene);
    this.createDesk(scene);
    this.createComputer(scene);
    this.createSignboard(scene);
    this.createCharacterSpritesheet(scene, 'player_sheet', '#3b82f6', '#1e293b');
    this.createCharacterSpritesheet(scene, 'npc_student_sheet', '#ec4899', '#334155');
    this.createCharacterSpritesheet(scene, 'npc_staff_sheet', '#10b981', '#1f2937');
    this.createCharacterSpritesheet(scene, 'npc_tech_sheet', '#f59e0b', '#374151');
  }

  private static createGrassTile(scene: Phaser.Scene) {
    if (scene.textures.exists('tile_grass')) return;
    const canvas = scene.textures.createCanvas('tile_grass', 32, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();
    ctx.fillStyle = '#2d6a4f';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#40916c';
    ctx.fillRect(4, 4, 4, 4);
    ctx.fillRect(20, 8, 4, 4);
    ctx.fillRect(10, 22, 4, 4);
    ctx.fillRect(26, 24, 4, 4);
    ctx.fillStyle = '#1b4332';
    ctx.fillRect(8, 12, 2, 2);
    ctx.fillRect(24, 18, 2, 2);
    canvas.refresh();
  }

  private static createPathTile(scene: Phaser.Scene) {
    if (scene.textures.exists('tile_path')) return;
    const canvas = scene.textures.createCanvas('tile_path', 32, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 32, 2);
    ctx.fillRect(0, 0, 2, 32);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(4, 4, 10, 10);
    ctx.fillRect(18, 18, 10, 10);
    canvas.refresh();
  }

  private static createWallTile(scene: Phaser.Scene) {
    if (scene.textures.exists('tile_wall')) return;
    const canvas = scene.textures.createCanvas('tile_wall', 32, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#334155';
    ctx.fillRect(2, 2, 28, 12);
    ctx.fillRect(2, 16, 28, 14);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 14, 32, 2);
    ctx.fillRect(16, 2, 2, 12);
    ctx.fillRect(8, 16, 2, 14);
    canvas.refresh();
  }

  private static createIndoorFloorTile(scene: Phaser.Scene) {
    if (scene.textures.exists('tile_indoor_floor')) return;
    const canvas = scene.textures.createCanvas('tile_indoor_floor', 32, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 32, 1);
    ctx.fillRect(0, 0, 1, 32);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, 2, 12, 12);
    ctx.fillRect(18, 18, 12, 12);
    canvas.refresh();
  }

  private static createTree(scene: Phaser.Scene) {
    if (scene.textures.exists('obj_tree')) return;
    const canvas = scene.textures.createCanvas('obj_tree', 48, 64);
    if (!canvas) return;
    const ctx = canvas.getContext();
    // Tronc
    ctx.fillStyle = '#78350f';
    ctx.fillRect(18, 42, 12, 22);
    // Feuillage
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(24, 28, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(20, 24, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#86efac';
    ctx.fillRect(14, 14, 6, 6);
    canvas.refresh();
  }

  private static createBench(scene: Phaser.Scene) {
    if (scene.textures.exists('obj_bench')) return;
    const canvas = scene.textures.createCanvas('obj_bench', 32, 24);
    if (!canvas) return;
    const ctx = canvas.getContext();
    ctx.fillStyle = '#92400e';
    ctx.fillRect(2, 4, 28, 8);
    ctx.fillRect(2, 14, 28, 6);
    ctx.fillStyle = '#475569';
    ctx.fillRect(4, 12, 3, 10);
    ctx.fillRect(25, 12, 3, 10);
    canvas.refresh();
  }

  private static createDoor(scene: Phaser.Scene) {
    if (scene.textures.exists('obj_door')) return;
    const canvas = scene.textures.createCanvas('obj_door', 32, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(3, 3, 26, 26);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(22, 16, 4, 4);
    canvas.refresh();
  }

  private static createDesk(scene: Phaser.Scene) {
    if (scene.textures.exists('obj_desk')) return;
    const canvas = scene.textures.createCanvas('obj_desk', 48, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, 48, 26);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 26, 48, 6);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(4, 4, 40, 4);
    canvas.refresh();
  }

  private static createComputer(scene: Phaser.Scene) {
    if (scene.textures.exists('obj_pc')) return;
    const canvas = scene.textures.createCanvas('obj_pc', 24, 24);
    if (!canvas) return;
    const ctx = canvas.getContext();
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(2, 2, 20, 14);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(4, 4, 16, 10);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(9, 16, 6, 4);
    ctx.fillRect(6, 20, 12, 2);
    canvas.refresh();
  }

  private static createSignboard(scene: Phaser.Scene) {
    if (scene.textures.exists('obj_sign')) return;
    const canvas = scene.textures.createCanvas('obj_sign', 32, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();
    ctx.fillStyle = '#78350f';
    ctx.fillRect(14, 16, 4, 16);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(2, 2, 28, 16);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, 4, 24, 12);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(8, 7, 16, 2);
    ctx.fillRect(8, 11, 10, 2);
    canvas.refresh();
  }

  private static createCharacterSpritesheet(scene: Phaser.Scene, key: string, shirtColor: string, pantsColor: string) {
    if (scene.textures.exists(key)) return;
    // Spritesheet de 4 colonnes (4 directions: Down, Left, Right, Up) x 3 frames
    const frameW = 24;
    const frameH = 32;
    const canvas = scene.textures.createCanvas(key, frameW * 3, frameH * 4);
    if (!canvas) return;
    const ctx = canvas.getContext();

    const directions = ['down', 'left', 'right', 'up'];

    for (let row = 0; row < 4; row++) {
      const dir = directions[row];
      for (let col = 0; col < 3; col++) {
        const x = col * frameW;
        const y = row * frameH;
        const legOffset = (col === 1 ? -2 : col === 2 ? 2 : 0);

        // Tête / Cheveux
        ctx.fillStyle = '#fcd34d'; // Peau
        ctx.fillRect(x + 6, y + 4, 12, 10);
        ctx.fillStyle = '#451a03'; // Cheveux
        ctx.fillRect(x + 5, y + 2, 14, 5);

        // Yeux selon direction
        ctx.fillStyle = '#000000';
        if (dir === 'down') {
          ctx.fillRect(x + 8, y + 8, 2, 2);
          ctx.fillRect(x + 14, y + 8, 2, 2);
        } else if (dir === 'left') {
          ctx.fillRect(x + 6, y + 8, 2, 2);
        } else if (dir === 'right') {
          ctx.fillRect(x + 16, y + 8, 2, 2);
        }

        // Haut / Vêtements
        ctx.fillStyle = shirtColor;
        ctx.fillRect(x + 5, y + 14, 14, 10);

        // Pantalon
        ctx.fillStyle = pantsColor;
        ctx.fillRect(x + 6, y + 24, 5, 6 + (legOffset > 0 ? legOffset : 0));
        ctx.fillRect(x + 13, y + 24, 5, 6 + (legOffset < 0 ? -legOffset : 0));

        // Chaussures
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 5, y + 29, 6, 3);
        ctx.fillRect(x + 13, y + 29, 6, 3);
      }
    }

    canvas.refresh();
  }
}