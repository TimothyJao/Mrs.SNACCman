//colors
export const BACKGROUND_COLOR = "rgb(0,0,0)"; //black
export const WALL_COLOR = "rgb(0,0,255)"; //blue
export const FONT = "20px monospace";
export const TEXT_COLOR = "rgb(255,255,255)"; //white
export const PELLET_COLOR = "rgb(255,255,95)";

//for drawing the actual board
export const PIXEL_SIZE = 27; //Size of each cell in the grid
export const PADDING = 35; //padding around the edge of the grid, possibly to render score onto or something

//for sprite rendering calculations
export const SPRITE_DURATION = 6; //how long to display each sprite before switching
export const SPRITE_PIXEL_SIZE = PIXEL_SIZE - 3; //Sprite size in pixels
export const IMG_SIZE = SPRITE_PIXEL_SIZE/PIXEL_SIZE; //Logical size of sprite img for calculating board position

export const BIG_PELLET_SIZE = Math.ceil(PIXEL_SIZE / 5);
export const PELLET_SIZE = Math.ceil(PIXEL_SIZE / 10);

export const FPS = 30;
export const SNACCMAN_MOVE_SPEED = 2 * 1/PIXEL_SIZE;

export const IMAGES = {
  snaccman: {
    left: [],
    right: [],
    up: [],
    down: []
  },
};

//preload images for drawing, callback when completed
export const loadImages = (callback)=>{
  let count = 0; //how many images have loaded?

  //snaccman images will be /image/up-1.png, ..., /images/right-3.png
  const directions = ["up", "down", "left", "right"];
  const sprites = 3; 

  directions.forEach(direction => {
    for(let i = 1; i <= sprites; i++){
      let img = new Image();
      img.onload = loaded;
      img.src = `images/${direction}-${i}.png`;
      IMAGES.snaccman[direction].push(img);
    }
  });
  //gets called when an image gets loaded
  function loaded(){
    count++;
    if(count >= directions.length * sprites){
      //execute callback when all images have successfully loaded
      callback();
    }
  }
};

//Expects grid to be a uniformly sized 2D array with coordinates [x][y]
export const GameWidth = (grid)=>((2*PADDING) + (PIXEL_SIZE*grid.length));
export const GameHeight = (grid)=>((2*PADDING) + (PIXEL_SIZE*grid[0].length));

//Takes in x,y coordinates and returns the [x,y] pixel position for the upper left corner of that cell
export const getStartPositionForCell = (x,y)=>[PADDING + (PIXEL_SIZE*x), PADDING + (PIXEL_SIZE*y)];
//Same, but for bottom right corner
export const getEndPositionForCell = (x, y) => [PADDING + (PIXEL_SIZE * (x + 1)) - 1, PADDING + (PIXEL_SIZE * (y+1))-1];

//transposes a grid
export const transposeGrid = (grid) => {
  const newGrid = [];
  for (let x = 0; x < grid[0].length; x++) {
    newGrid[x] = [];
  }
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[x].length; x++) {
      newGrid[x][y] = grid[y][x];
    }
  }
  return newGrid;
};