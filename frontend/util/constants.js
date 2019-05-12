//colors
export const BACKGROUND_COLOR = "rgb(0,0,0)"; //black
export const WALL_COLOR = "rgb(0,0,255)"; //blue
export const FONT = "20px monospace";
export const TEXT_COLOR = "rgb(255,255,255)"; //white
export const PELLET_COLOR = "rgb(255,255,95)";

//for drawing the actual board
export const PIXEL_SIZE = 27; //Size of each cell in the grid
export const PADDING = 35; //padding around the edge of the grid, possibly to render score onto or something
export const WALL_STROKE = 1; //How thick our drawn walls should be

export const WALL_SIZE = 1 / PIXEL_SIZE; //for wall collision calculations

//for sprite rendering calculations
export const SPRITE_DURATION = 6; //how long to display each sprite before switching
export const SPRITE_PIXEL_SIZE = PIXEL_SIZE - 3; //Sprite size in pixels
export const IMG_SIZE = SPRITE_PIXEL_SIZE / PIXEL_SIZE; //Logical size of sprite img for calculating board position

export const BIG_PELLET_SIZE = Math.ceil(PIXEL_SIZE / 5);
export const PELLET_SIZE = Math.ceil(PIXEL_SIZE / 10);

export const FPS = 30;
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
};
