//colors
export const BACKGROUND_COLOR = "rgb(0,0,0)"; //black
export const WALL_COLOR = "rgb(0,0,255)"; //blue

//for drawing the actual board
export const PIXEL_SIZE = 27; //Size of each cell in the grid
export const PADDING = 20; //padding around the edge of the grid, possibly to render score onto or something

//for sprite rendering calculations
export const SPRITE_DURATION = 6; //how long to display each sprite before switching
export const SPRITE_PIXEL_SIZE = 24; //Sprite size in pixels
export const IMG_SIZE = SPRITE_PIXEL_SIZE/PIXEL_SIZE; //Logical size of sprite img for calculating board position

//offset the sprite for transparent padding
export const SPRITE_OFFSET_X = 0; //pixel size for invisible left padding
export const SPRITE_OFFSET_Y = 0; //pixel size for invisible top padding
export const OFFSET_X_SIZE = SPRITE_OFFSET_X/PIXEL_SIZE; //in logical size
export const OFFSET_Y_SIZE = SPRITE_OFFSET_Y/PIXEL_SIZE; //in logical size

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

const EmptyCell = { canMoveUp: ()=>true, canMoveDown: ()=> true, canMoveRight: () => true, canMoveLeft: () => true};
const EmptyCol = [
  EmptyCell,
  EmptyCell,
  EmptyCell,
  EmptyCell,
  EmptyCell,
  EmptyCell,
  EmptyCell,
];
//Temporary grid for testing, has every possible movement combo at least once
export const testGrid = [
  [
    { canMoveUp: () => false, canMoveDown: () => false, canMoveRight: () => false, canMoveLeft: () => false },
    EmptyCell,
    { canMoveUp: () => false, canMoveDown: () => false, canMoveRight: () => false, canMoveLeft: () => false },
    EmptyCell,
    { canMoveUp: () => false, canMoveDown: () => false, canMoveRight: () => false, canMoveLeft: () => false },
    EmptyCell,
    { canMoveUp: () => false, canMoveDown: () => false, canMoveRight: () => false, canMoveLeft: () => false },
  ],
  EmptyCol,
  [
    { canMoveUp: () => false, canMoveDown: () => false, canMoveRight: () => false, canMoveLeft: () => true },
    EmptyCell,
    { canMoveUp: () => false, canMoveDown: () => false, canMoveRight: () => true, canMoveLeft: () => false },
    EmptyCell,
    { canMoveUp: () => false, canMoveDown: () => true, canMoveRight: () => false, canMoveLeft: () => false },
    EmptyCell,
    { canMoveUp: () => true, canMoveDown: () => false, canMoveRight: () => false, canMoveLeft: () => false },
  ],
  EmptyCol,
  [
    { canMoveUp: () => false, canMoveDown: () => false, canMoveRight: () => false, canMoveLeft: () => true },
    EmptyCell,
    { canMoveUp: () => false, canMoveDown: () => false, canMoveRight: () => true, canMoveLeft: () => true },
    EmptyCell,
    { canMoveUp: () => false, canMoveDown: () => true, canMoveRight: () => false, canMoveLeft: () => true },
    EmptyCell,
    { canMoveUp: () => true, canMoveDown: () => false, canMoveRight: () => false, canMoveLeft: () => true },
  ],
  EmptyCol,
  [
    { canMoveUp: () => false, canMoveDown: () => false, canMoveRight: () => true, canMoveLeft: () => true },
    EmptyCell,
    { canMoveUp: () => false, canMoveDown: () => false, canMoveRight: () => true, canMoveLeft: () => false },
    EmptyCell,
    { canMoveUp: () => false, canMoveDown: () => true, canMoveRight: () => true, canMoveLeft: () => false },
    EmptyCell,
    { canMoveUp: () => true, canMoveDown: () => false, canMoveRight: () => true, canMoveLeft: () => false },
  ],
  EmptyCol,
  [
    { canMoveUp: () => false, canMoveDown: () => true, canMoveRight: () => false, canMoveLeft: () => true },
    EmptyCell,
    { canMoveUp: () => false, canMoveDown: () => true, canMoveRight: () => true, canMoveLeft: () => false },
    EmptyCell,
    { canMoveUp: () => false, canMoveDown: () => true, canMoveRight: () => true, canMoveLeft: () => false },
    EmptyCell,
    { canMoveUp: () => true, canMoveDown: () => true, canMoveRight: () => true, canMoveLeft: () => false },
  ],
  EmptyCol,
  [
    { canMoveUp: () => true, canMoveDown: () => false, canMoveRight: () => false, canMoveLeft: () => true },
    EmptyCell,
    { canMoveUp: () => true, canMoveDown: () => false, canMoveRight: () => true, canMoveLeft: () => false },
    EmptyCell,
    { canMoveUp: () => true, canMoveDown: () => true, canMoveRight: () => false, canMoveLeft: () => false },
    EmptyCell,
    { canMoveUp: () => true, canMoveDown: () => false, canMoveRight: () => false, canMoveLeft: () => false },
  ],
  EmptyCol,
  [
    { canMoveUp: () => true, canMoveDown: () => true, canMoveRight: () => true, canMoveLeft: () => false },
    EmptyCell,
    { canMoveUp: () => true, canMoveDown: () => true, canMoveRight: () => false, canMoveLeft: () => true },
    EmptyCell,
    { canMoveUp: () => true, canMoveDown: () => false, canMoveRight: () => true, canMoveLeft: () => true },
    EmptyCell,
    { canMoveUp: () => false, canMoveDown: () => true, canMoveRight: () => true, canMoveLeft: () => true },
  ],
  EmptyCol,
  [
    { canMoveUp: () => true, canMoveDown: () => true, canMoveRight: () => true, canMoveLeft: () => true },
    EmptyCell,
    { canMoveUp: () => true, canMoveDown: () => true, canMoveRight: () => true, canMoveLeft: () => true },
    EmptyCell,
    { canMoveUp: () => true, canMoveDown: () => true, canMoveRight: () => true, canMoveLeft: () => true },
    EmptyCell,
    { canMoveUp: () => true, canMoveDown: () => true, canMoveRight: () => true, canMoveLeft: () => true },
  ]
];

//rotated test grid
export const transposedTestGrid = transposeGrid(testGrid);