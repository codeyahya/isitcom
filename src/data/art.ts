// Registre central des tuiles — sélection manuelle, AUCUNE génération procédurale.
// Les coordonnées (c = colonne, r = rangée) sont des points de départ :
// lance le jeu avec #tiles à la fin de l'URL pour naviguer dans les feuilles
// (flèches gauche/droite = changer de feuille, clic sur une tuile = copier c,r).

export const SHEETS = {
  urban:  { key: 'urban',   url: 'kenney_rpg-urban-pack/Tilemap/tilemap_packed.png', cols: 27 },
  miRoom: { key: 'mi_room', url: 'Modern_Interiors_Free_v2.2/Modern tiles_Free/Interiors_free/16x16/Room_Builder_free_16x16.png', cols: 17 },
  miFurn: { key: 'mi_furn', url: 'Modern_Interiors_Free_v2.2/Modern tiles_Free/Interiors_free/16x16/Interiors_free_16x16.png', cols: 16 }
} as const;

export const LOOSE_ASSETS = {
  campusGrass: 'kenney_rpg-urban-pack/Tiles/tile_0000.png',
  campusPath: 'kenney_rpg-urban-pack/Tiles/tile_0008.png',
  lpcGrass: 'lpc_base_assets/LPC Base Assets/tiles/grass.png'
} as const;

const f = (sheet: keyof typeof SHEETS, c: number, r: number) => {
  const s = SHEETS[sheet];
  return { key: s.key, frame: r * s.cols + c, c, r };
};

// --- EXTÉRIEUR (urban) — à affiner avec le navigateur de tuiles ---
export const URBAN = {
  GRASS:        f('urban', 5, 0),
  GRASS_FLOWER: f('urban', 5, 0),
  SIDEWALK:    f('urban', 5, 3),
  WALL_EXT:    f('urban', 5, 4),
  WALL_ROOF:   f('urban', 5, 3),
  DOOR_GLASS:  f('urban', 8, 15),
  TREE_GREEN:  f('urban', 19, 8),
  TREE_ORANGE: f('urban', 19, 12),
  BENCH:       f('urban', 4, 6),
  LAMP:        f('urban', 0, 6),
  HEDGE:       f('urban', 19, 10),
  FOUNTAIN:    f('urban', 2, 7),
  ROAD:        f('urban', 9, 0),
  ROAD_MARK:   f('urban', 10, 0),
  GATE:        f('urban', 8, 15),
  BULLETIN:    f('urban', 12, 13)
};

export const URBAN_VARIANTS = {
  GRASS: [URBAN.GRASS, URBAN.GRASS_FLOWER],
  PATH: [URBAN.SIDEWALK, f('urban', 4, 3), f('urban', 6, 3)],
  WALL: [URBAN.WALL_EXT, f('urban', 1, 4), f('urban', 2, 4)],
  ROOF: [URBAN.WALL_ROOF, f('urban', 4, 3), f('urban', 6, 3)],
  WINDOWS: [f('urban', 8, 13), f('urban', 9, 13), f('urban', 10, 13)]
};

// --- INTÉRIEUR : murs & sols (mi_room) — à affiner avec le navigateur ---
export const ROOM = {
  WALL:        f('miRoom', 0, 17),
  WALL_BASE:   f('miRoom', 0, 18),
  FLOOR_TILE:  f('miRoom', 8, 9),  // carrelage couloir / classes
  FLOOR_WOOD:  f('miRoom', 3, 13), // parquet bureaux
  FLOOR_CARPET:f('miRoom', 3, 6),  // moquette
  FLOOR_GRAY:  f('miRoom', 3, 16), // sol gris (service technique)
  DOOR:        f('miRoom', 5, 17),
  WINDOW:      f('miRoom', 5, 18)
};

export const ROOM_FLOORS = [
  ROOM.FLOOR_TILE,
  f('miRoom', 9, 9),
  f('miRoom', 10, 9),
  f('miRoom', 4, 13),
  f('miRoom', 5, 13)
];

export const ROOM_WALLS = [
  ROOM.WALL_BASE,
  f('miRoom', 1, 18),
  f('miRoom', 2, 18),
  f('miRoom', 3, 18)
];

// --- INTÉRIEUR : mobilier (mi_furn) — à affiner avec le navigateur ---
export const FURN = {
  DESK:        f('miFurn', 0, 10), // grand bureau (2 tuiles de large)
  DESK_SIDE:   f('miFurn', 1, 10),
  COMPUTER:    f('miFurn', 4, 10), // écran sur pied
  CHAIR:       f('miFurn', 6, 10),
  SHELF:       f('miFurn', 8, 10), // étagère d'archives
  PLANT:       f('miFurn', 10, 10),
  SOFA:        f('miFurn', 12, 10),// canapé d'attente
  PRINTER:     f('miFurn', 14, 10),
  COOLER:      f('miFurn', 0, 12), // fontaine à eau
  COUNTER:     f('miFurn', 2, 12), // comptoir d'accueil
  CLOCK:       f('miFurn', 5, 12),
  BOARD:       f('miFurn', 7, 12)  // tableau d'affichage
};

export const FURN_VARIANTS = {
  DESKS: [FURN.DESK, FURN.DESK_SIDE, f('miFurn', 0, 11), f('miFurn', 1, 11)],
  CHAIRS: [FURN.CHAIR, f('miFurn', 7, 10), f('miFurn', 6, 11)],
  STORAGE: [FURN.SHELF, f('miFurn', 9, 10), f('miFurn', 8, 11)],
  SCREENS: [FURN.COMPUTER, f('miFurn', 5, 10), f('miFurn', 4, 11)],
  PLANTS: [FURN.PLANT, f('miFurn', 11, 10), f('miFurn', 10, 11)],
  PAPERWORK: [FURN.PRINTER, f('miFurn', 15, 10), f('miFurn', 14, 11)]
};

// Sol de chaque service (ambiance différente par bureau)
export const SERVICE_FLOOR: Record<string, { key: string; frame: number }> = {
  service_etudiant:    ROOM.FLOOR_WOOD,
  service_administratif: ROOM.FLOOR_CARPET,
  service_pedagogique: ROOM.FLOOR_TILE,
  service_technique:   ROOM.FLOOR_GRAY
};

// Personnages (grille 3×4 de 32px — compatible tel quel avec Player.ts)
export const CHARACTERS: Record<string, string> = {
  player_sheet:  'assets/characters/player.png',
  yassine_sheet: 'assets/characters/student.png',
  sarra_sheet:   'assets/characters/delegate.png',
  staff_etudiant_sheet:  'assets/characters/staff_student.png',
  staff_admin_sheet:     'assets/characters/staff_admin.png',
  staff_pedago_sheet:    'assets/characters/staff_pedago.png',
  staff_tech_sheet:      'assets/characters/staff_tech.png'
};