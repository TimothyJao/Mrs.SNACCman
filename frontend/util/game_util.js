export const BACKGROUND_COLOR = "rgb(0,0,0)"; //black
export const WALL_COLOR = "rgb(0,0,255)"; //blue
export const PIXEL_SIZE = 32; //Size of each cell in the grid
export const PADDING = 30; //padding around the edge of the grid, possibly to render score onto or something
export const FPS = 30; //change FPS

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