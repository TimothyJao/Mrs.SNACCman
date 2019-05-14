//colors
const HAWT_PINK = "rgb(197,59,148)";
const SEAFOAM = "rgb(102, 197, 185)";
const BLACK = "rgb(0,0,0)";
const WHITE = "rgb(255,255,255)";
const HAWTER_PINK = "rgb(231, 101, 143";

export const BACKGROUND_COLOR = BLACK;
export const WALL_COLOR = WHITE;
export const WALL_FILL_COLOR = HAWT_PINK;
export const WALL_FLASH_COLOR = HAWT_PINK;
export const WALL_FILL_FLASH_COLOR = HAWTER_PINK;
export const FONT = "24px 'Press Start 2P'";
export const FONT_SMALL = "16px 'Press Start 2P'";
export const TEXT_OUTLINE_COLOR = SEAFOAM;
export const TEXT_COLOR = WHITE;
export const PELLET_COLOR = WHITE;
export const ALT_PELLET_COLOR = HAWT_PINK;
//for drawing the actual board
export const PIXEL_SIZE = 27; //Size of each cell in the grid
export const PADDING = 40; //padding around the edge of the grid, possibly to render score onto or something
export const WALL_STROKE = 1; //How thick our drawn walls should be

export const WALL_SIZE = 1 / PIXEL_SIZE; //for wall collision calculations

//for sprite rendering calculations
export const SPRITE_DURATION = 6; //how long to display each sprite before switching
export const SPRITE_PIXEL_SIZE = PIXEL_SIZE - 3; //Sprite size in pixels
export const IMG_SIZE = SPRITE_PIXEL_SIZE / PIXEL_SIZE; //Logical size of sprite img for calculating board position

export const BIG_PELLET_SIZE = Math.ceil(PIXEL_SIZE / 5);
export const PELLET_SIZE = Math.ceil(PIXEL_SIZE / 10);

export const FPS = 60;
export const MOVE_SPEED = 2 * 1 / PIXEL_SIZE;

//populated by GameUtil via loadImages()
export const IMAGES = {
  snaccman: {
    left: [],
    right: [],
    up: [],
    down: [],
    super: {
      left: [],
      right: [],
      up: [],
      down: []
    }
  },
  ghost: {
    dead: [],
    super: [],
    color: []
  }
};
