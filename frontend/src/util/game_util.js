import {IMAGES, PADDING, PIXEL_SIZE, IMG_SIZE, WALL_SIZE} from "./constants";

//for doing maths
export class GameUtil{
  constructor(grid){
  //Expects grid to be a uniformly sized 2D array with coordinates [x][y]
    this.grid = grid;
    this.setupNeighbors();
  }
  setupNeighbors(){
    this.grid.forEach((row, x)=>{
      row.forEach((cell, y)=>{
        cell.neighbors = [];
        if(cell.canMoveUp()){
          cell.neighbors.push(this.getCellAtPos([x, y-1]));
        }
        if(cell.canMoveDown()){
          cell.neighbors.push(this.getCellAtPos([x, y+1]));
        }
        if(cell.canMoveLeft()){
          cell.neighbors.push(this.getCellAtPos([x-1, y]));
        }
        if(cell.canMoveRight()){
          cell.neighbors.push(this.getCellAtPos([x+1, y]));
        }
      });
    });
  }
  //preload images for drawing, callback when completed
  loadImages(callback){
    let count = 0; //how many images have loaded?

    //snaccman images will be /image/up-1.png, ..., /images/right-3.png
    const directions = ["up", "down", "left", "right"];
    const sprites = 3;
    let total = 0;

    directions.forEach(direction => {
      for (let i = 1; i <= sprites; i++) {
        total+=2; //normal and super sprites!

        let img = new Image();
        img.onload = loaded;
        img.src = `images/${direction}-${i}.png`;
        IMAGES.snaccman[direction].push(img);
  
        img = new Image();
        img.onload = loaded;
        img.src = `images/super-${direction}-${i}.png`;
        IMAGES.snaccman["super"][direction].push(img);
      }
    });
    for(let i = 0; i < 4; i++){
      total+=1;
      let img = new Image();
      img.onload = loaded;
      img.src = `images/ghost-${i}.png`;
      IMAGES.ghost.color.push(img);
    }
    for (let i = 0; i < 2; i++) {
      total += 1;
      let img = new Image();
      img.onload = loaded;
      img.src = `images/super-ghost-${i}.png`;
      IMAGES.ghost.super.push(img);
    }
    for (let i = 0; i < 1; i++) {
      total += 1;
      let img = new Image();
      img.onload = loaded;
      img.src = `images/ghost-dead-${i}.png`;
      IMAGES.ghost.dead.push(img);
    }
    //gets called when an image gets loaded
    function loaded() {
      count++;
      if (count >= total) {
        //execute callback when all images have successfully loaded
        callback();
      }
    }
  }
  //Width and Height in pixels
  GameWidth(){
    return ((2 * PADDING) + (PIXEL_SIZE * this.getWidth()));
  }
  GameHeight(){
    return ((2 * PADDING) + (PIXEL_SIZE * this.getHeight()));
  }
  //Takes in x,y coordinates and returns the [x,y] pixel position for the upper left corner of that cell
  getStartPositionForCell(x, y){
    return [PADDING + (PIXEL_SIZE * x), PADDING + (PIXEL_SIZE * y)];
  }
  //Same, but for bottom right corner
  getEndPositionForCell(x, y){
    return [PADDING + (PIXEL_SIZE * (x + 1)) - 1, PADDING + (PIXEL_SIZE * (y + 1)) - 1];
  }
  //Width / Height in number of cells
  getWidth(){
    return this.grid.length;
  }
  getHeight(){
    return this.grid[0].length;
  }
  getGrid(){
    return this.grid;
  }
  getCell(x,y){
    return this.grid[Math.floor(this.wrapX(x))][Math.floor(this.wrapY(y))];
  }
  wrapX(x) {
    return ((x % this.getWidth()) + this.getWidth()) % this.getWidth();
  }
  wrapY(y) {
    return ((y % this.getHeight()) + this.getHeight()) % this.getHeight();
  }
  wrapPos([x,y]){
    return [this.wrapX(x), this.wrapY(y)];
  }
  getCellAtPos([x,y]){
    return this.getCell(x,y);
  }
  getTopLeftCell(entity){
    const [x,y] = entity.pos;
    const left = (x + WALL_SIZE);
    const top = (y + WALL_SIZE);
    return this.getCell(left, top);
  }
  getBottomLeftCell(entity){
    const size = entity.size || IMG_SIZE;
    const [x,y] = entity.pos;
    const left = (x + WALL_SIZE);
    const bottom = (y + size + 2 * WALL_SIZE);
    return this.getCell(left, bottom);
  }
  getTopRightCell(entity){
    const size = entity.size || IMG_SIZE;
    const [x,y] = entity.pos;
    const top = (y + WALL_SIZE);
    const right = (x + size + 2 * WALL_SIZE);
    return this.getCell(right, top);
  }
  getBottomRightCell(entity){
    const size = entity.size || IMG_SIZE;
    const [x,y] = entity.pos;
    const right = (x + size + 2 * WALL_SIZE);
    const bottom = (y + size + 2 * WALL_SIZE);
    return this.getCell(right, bottom);
  }
}

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

//distance formula a la pythagoras
export const distance = (p1, p2)=>{
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  return Math.sqrt(dx * dx + dy * dy);
};


/* shortestPath - return shortest path coordinates from source to target cell */
/* I chose this code since it was the first time I used a theoretical algorithm 
in an actual project. Here, I use BFS to find the ghost's optimal path to the player.*/
export const shortestPath = (source, target) => {
  const queue = [];
  const visited = [];
  const path = {};
  queue.push(source);
  while (queue.length > 0) {
    const currentPosition = queue.shift();
    visited.push(currentPosition);
    if (currentPosition === target) {
      return path;
    }
    const neighbors = currentPosition.neighbors;
    for (let i = 0; i < neighbors.length; i++) {
      if (visited.includes(neighbors[i]) === false) {
        queue.push(neighbors[i]);
        path[neighbors[i].toString()] = currentPosition;
      }
    }
  }
};

//https://stackoverflow.com/a/19303725
export const random = (seed)=>{
  const x = Math.sin(seed)*10000;
  return x - Math.floor(x);
};