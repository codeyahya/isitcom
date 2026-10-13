import Phaser from 'phaser';

export class AssetGenerator {
  public static createAllTextures(scene: Phaser.Scene): void {
    this.createCozyTiles(scene);
    this.createModernFurniture(scene);
    this.createDistinctCharacters(scene);
  }

  private static createCozyTiles(scene: Phaser.Scene) {
    // 1. Parquet en bois clair chaleureux (Style Réception - Image 2)
    if (!scene.textures.exists('tile_wood_parquet')) {
      const c = scene.textures.createCanvas('tile_wood_parquet', 32, 32);
      if (c) {
        const ctx = c.getContext();
        ctx.fillStyle = '#e5b887'; // Bois clair doux
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#d6a36f';
        ctx.fillRect(0, 15, 32, 1);
        ctx.fillRect(0, 31, 32, 1);
        ctx.fillRect(16, 0, 1, 15);
        ctx.fillRect(8, 16, 1, 15);
        // Clous discrets
        ctx.fillStyle = '#b7804d';
        ctx.fillRect(2, 2, 1, 1);
        ctx.fillRect(18, 18, 1, 1);
        c.refresh();
      }
    }

    // 2. Carrelage beige doux de couloir / classe (Style Image 1)
    if (!scene.textures.exists('tile_classroom_floor')) {
      const c = scene.textures.createCanvas('tile_classroom_floor', 32, 32);
      if (c) {
        const ctx = c.getContext();
        ctx.fillStyle = '#eddcc4'; // Beige crème très reposant
        ctx.fillRect(0, 0, 32, 32);
        ctx.strokeStyle = '#debfa2';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, 32, 32);
        ctx.fillStyle = '#f5e9d9';
        ctx.fillRect(2, 2, 14, 14);
        c.refresh();
      }
    }

    // 3. Mur moderne crème et boiserie
    if (!scene.textures.exists('tile_modern_wall')) {
      const c = scene.textures.createCanvas('tile_modern_wall', 32, 32);
      if (c) {
        const ctx = c.getContext();
        ctx.fillStyle = '#faf8f5'; // Crème lumineux
        ctx.fillRect(0, 0, 32, 24);
        ctx.fillStyle = '#8b5a2b'; // Plinthe en bois chaleureux
        ctx.fillRect(0, 24, 32, 8);
        ctx.fillStyle = '#5c3a17';
        ctx.fillRect(0, 31, 32, 1);
        c.refresh();
      }
    }

    // 4. Pelouse extérieure vert pastel douce (non agressive)
    if (!scene.textures.exists('tile_soft_grass')) {
      const c = scene.textures.createCanvas('tile_soft_grass', 32, 32);
      if (c) {
        const ctx = c.getContext();
        ctx.fillStyle = '#8bc34a'; // Vert prairie doux
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#9ccc65';
        ctx.fillRect(4, 4, 3, 3);
        ctx.fillRect(18, 14, 3, 3);
        ctx.fillRect(10, 22, 2, 2);
        c.refresh();
      }
    }

    // 5. Allée extérieure pavée claire
    if (!scene.textures.exists('tile_clean_path')) {
      const c = scene.textures.createCanvas('tile_clean_path', 32, 32);
      if (c) {
        const ctx = c.getContext();
        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(0, 0, 32, 32);
        ctx.strokeStyle = '#b0bec5';
        ctx.strokeRect(0, 0, 32, 32);
        c.refresh();
      }
    }
  }

  private static createModernFurniture(scene: Phaser.Scene) {
    // Grand comptoir de réception d'accueil (Style Image 2)
    if (!scene.textures.exists('obj_modern_counter')) {
      const c = scene.textures.createCanvas('obj_modern_counter', 64, 32);
      if (c) {
        const ctx = c.getContext();
        ctx.fillStyle = '#374151'; // Comptoir anthracite moderne
        ctx.fillRect(0, 4, 64, 28);
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 0, 64, 6);
        // Écran d'accueil & livre de registre
        ctx.fillStyle = '#60a5fa';
        ctx.fillRect(8, 2, 12, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(36, 4, 16, 8); // Registre ouvert
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(38, 6, 12, 1);
        c.refresh();
      }
    }

    // Casiers scolaires de couloir (Style Image 1)
    if (!scene.textures.exists('obj_lockers')) {
      const c = scene.textures.createCanvas('obj_lockers', 32, 32);
      if (c) {
        const ctx = c.getContext();
        ctx.fillStyle = '#90a4ae'; // Casiers métalliques bleutés
        ctx.fillRect(2, 0, 28, 32);
        ctx.strokeStyle = '#607d8b';
        ctx.strokeRect(2, 0, 14, 32);
        ctx.strokeRect(16, 0, 14, 32);
        // Poignées & aérations
        ctx.fillStyle = '#374151';
        ctx.fillRect(12, 14, 2, 4);
        ctx.fillRect(26, 14, 2, 4);
        c.refresh();
      }
    }

    // Bureau scolaire en bois avec cahier (Style Image 1)
    if (!scene.textures.exists('obj_school_desk')) {
      const c = scene.textures.createCanvas('obj_school_desk', 32, 32);
      if (c) {
        const ctx = c.getContext();
        ctx.fillStyle = '#c7925a'; // Plateau bois chaleureux
        ctx.fillRect(2, 4, 28, 16);
        ctx.fillStyle = '#8f5f2a';
        ctx.fillRect(4, 20, 4, 10);
        ctx.fillRect(24, 20, 4, 10);
        // Cahier ouvert
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(10, 8, 10, 8);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(10, 8, 2, 8);
        c.refresh();
      }
    }
  }

  private static createDistinctCharacters(scene: Phaser.Scene) {
    // 1. Joueur (Étudiant en veste bleue et jean)
    this.drawCharacter(scene, 'char_player', '#2563eb', '#1e293b', '#6b3e1d', 'short');

    // 2. Yassine (Étudiant extérieur en sweat rouge et casquette)
    this.drawCharacter(scene, 'char_yassine', '#dc2626', '#374151', '#262626', 'cap');

    // 3. Sarra (Déléguée dans le couloir, cheveux longs blonds, pull vert)
    this.drawCharacter(scene, 'char_sarra', '#16a34a', '#1e293b', '#d97706', 'long');

    // 4. Mme Ben Salem (Service Étudiant - Image 2 : Veste élégante violette)
    this.drawCharacter(scene, 'char_ben_salem', '#7c3aed', '#111827', '#451a03', 'bun');

    // 5. M. Mansour (Service Administratif - Costume cravate sombre)
    this.drawCharacter(scene, 'char_mansour', '#1f2937', '#111827', '#6b7280', 'tie');

    // 6. Dr. Karoui (Service Pédagogique - Blouse / Veste universitaire beige)
    this.drawCharacter(scene, 'char_karoui', '#d97706', '#374151', '#e5e7eb', 'glasses');

    // 7. Ing. Slim (Service Technique - T-shirt IT noir & écouteurs)
    this.drawCharacter(scene, 'char_slim', '#0f172a', '#4b5563', '#1e1b4b', 'tech');
  }

  private static drawCharacter(
    scene: Phaser.Scene,
    key: string,
    topColor: string,
    pantsColor: string,
    hairColor: string,
    style: 'short' | 'long' | 'cap' | 'bun' | 'tie' | 'glasses' | 'tech'
  ) {
    if (scene.textures.exists(key)) return;
    const c = scene.textures.createCanvas(key, 32 * 3, 32 * 4);
    if (!c) return;
    const ctx = c.getContext();

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const x = col * 32;
        const y = row * 32;
        const leg = col === 0 ? -2 : col === 2 ? 2 : 0;

        // Corps & Vêtements
        ctx.fillStyle = topColor;
        ctx.fillRect(x + 9, y + 13, 14, 10);

        if (style === 'tie') {
          ctx.fillStyle = '#dc2626'; // Cravate rouge
          ctx.fillRect(x + 15, y + 14, 2, 7);
        }

        // Pantalon
        ctx.fillStyle = pantsColor;
        ctx.fillRect(x + 10, y + 23, 5, 7 + leg);
        ctx.fillRect(x + 17, y + 23, 5, 7 - leg);

        // Tête / Visage peau douce
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(x + 10, y + 4, 12, 10);

        // Yeux selon la direction
        ctx.fillStyle = '#1e293b';
        if (row === 0) { // Bas
          ctx.fillRect(x + 12, y + 8, 2, 2);
          ctx.fillRect(x + 18, y + 8, 2, 2);
        } else if (row === 1) { // Gauche
          ctx.fillRect(x + 10, y + 8, 2, 2);
        } else if (row === 2) { // Droite
          ctx.fillRect(x + 20, y + 8, 2, 2);
        }

        // Chevelure personnalisée
        ctx.fillStyle = hairColor;
        ctx.fillRect(x + 9, y + 2, 14, 5); // Base

        if (style === 'long') {
          ctx.fillRect(x + 8, y + 6, 3, 10); // Mèches longues
          ctx.fillRect(x + 21, y + 6, 3, 10);
        } else if (style === 'bun') {
          ctx.fillRect(x + 13, y, 6, 4); // Chignon
        } else if (style === 'cap') {
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(x + 8, y + 1, 16, 4); // Visière casquette
        } else if (style === 'glasses') {
          ctx.fillStyle = '#0284c7';
          ctx.strokeRect(x + 11, y + 7, 10, 4); // Lunettes
        }
      }
    }
    c.refresh();
  }
}