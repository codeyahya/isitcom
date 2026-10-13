export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const TILE_SIZE = 16;
export const TILE_SCALE = 2; // Échelle x2 pour un pixel art rétro 32x32 net et lisible
export const SCALED_TILE = TILE_SIZE * TILE_SCALE; // 32px
export const PLAYER_SPEED = 140;

export const SAVE_KEY = 'campus_quest_isitcom_save_v1';

// --- Indices des tuiles découpées dans roguelikeSheet_transparent.png ---
export const TILES = {
  // Sols extérieurs
  GRASS: 57 * 4 + 5,         // Pelouse verte unie
  GRASS_FLOWERS: 57 * 4 + 0, // Pelouse fleurie
  PATH: 57 * 6 + 1,          // Allée pavée / trottoir
  
  // Bâtiment extérieur ISITCOM (style pierre / université)
  WALL_EXT: 57 * 12 + 19,    // Façade murale pierre
  WALL_ROOF: 57 * 11 + 19,   // Bordure de toit
  ENTRANCE_DOOR: 57 * 2 + 37,// Grande porte d'entrée en bois
  
  // Végétation & extérieur
  TREE_TOP: 57 * 5 + 13,     // Arbre
  BENCH: 57 * 1 + 24,        // Banc public
  SIGN: 57 * 1 + 17,         // Panneau / panneau de direction

  // Intérieur (Couloir et Salles de service)
  FLOOR_INDOOR: 57 * 3 + 10, // Carrelage beige intérieur
  FLOOR_SERVICE: 57 * 2 + 2, // Sol bureau
  WALL_INT: 57 * 13 + 19,    // Mur intérieur
  DOOR_OFFICE: 57 * 2 + 35,  // Porte de bureau
  
  // Mobilier des 4 services
  DESK: 57 * 2 + 21,         // Bureau / table en bois
  CHAIR: 57 * 1 + 22,        // Chaise
  BOOKSHELF: 57 * 7 + 36,    // Étagère d'archives / dossiers
  COMPUTER: 57 * 8 + 48      // Ordinateur / équipement
};