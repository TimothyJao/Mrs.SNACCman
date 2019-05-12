import React from "react";

import * as GameUtil from "../util/game_util";

class Game extends React.Component{
  constructor(props){
    super(props);
    this.frame = 0;
    this.isBig = 0;
    this.lives = 3;
    this.gameOver = false;

    // this.snaccman = props.snaccman;
    // this.ghosts = props.ghosts;
    // this.pellets = props.pellets;
    //cache the grid so we don't have to recompute function calls
    this.grid = [];
    props.grid.forEach((row, x)=>{
      this.grid[x] = [];
      row.forEach((cell, y)=>{
        this.grid[x][y]={
          canMoveUp: cell.canMoveUp(),
          canMoveDown: cell.canMoveDown(),
          canMoveLeft: cell.canMoveLeft(),
          canMoveRight: cell.canMoveRight()
        };
      });
    });

    //temporary variables for testing
    //this.grid = GameUtil.transposedTestGrid;
    this.snaccman = {
      pos: [1,14], //figure out the real starting coords
      velocity: [1,0]
    };
    this.bufferedVelocity = this.snaccman.velocity;

    this.nextFrame = this.nextFrame.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }
  componentDidMount(){
    //set up drawing context
    this.ctx = document.querySelector("#game-canvas").getContext("2d");
    this.ctx.fillStyle = GameUtil.BACKGROUND_COLOR;
    this.ctx.strokeStyle = GameUtil.WALL_COLOR;
    //load the image assets, start rendering once they are loaded
    GameUtil.loadImages(()=>{
      document.addEventListener("keydown", this.handleInput);
      this.intervalId = setInterval(this.nextFrame, 1000 / GameUtil.FPS);
    });
  }
  componentWillUnmount(){
    //cleanup
    clearInterval(this.intervalId);
    document.removeEventListener("keydown", this.handleInput);
  }
  handleInput(e){
    switch(e.keyCode){
      case 81: //q quits the game for testing
        console.log("Snaccman: ");
        console.log(this.snaccman);
        console.log("BufferedVelocity: ");
        console.log(this.bufferedVelocity);
        console.log("Grid");
        console.log(this.grid);
        clearInterval(this.intervalId);
        document.removeEventListener("keydown", this.handleInput);
        break;
      case 38: //arrow up
      case 87: //W
        this.bufferedVelocity = [0,-1];
        break;
      case 37: //arrow left
      case 65: //A
        this.bufferedVelocity = [-1,0];
        break;
      case 40: //arrow down
      case 83: //S
        this.bufferedVelocity = [0,1];
        break;
      case 39: //arrow right
      case 68: //D
        this.bufferedVelocity = [1, 0];
        break;
    }
  }
  nextFrame() {
    this.frame += 1;
    this.updatePositions();
    this.checkCollisions();
    this.draw();
  }

  updatePositions(){
    this.previousVelocity = this.snaccman.velocity;
    this.snaccman.velocity = this.bufferedVelocity;
    const moved = this.updateSnaccman();
    //let players buffer inputs, try to continue moving in current direction if it fails
    if(!moved && this.snaccman.velocity != this.previousVelocity){
      this.snaccman.velocity = this.previousVelocity;
      this.updateSnaccman();
    }else{
      this.bufferedVelocity = this.snaccman.velocity;
    }
  }

  
  updateSnaccman(){
    const [current_x, current_y] = this.snaccman.pos;
    let next_x = current_x + this.snaccman.velocity[0]*GameUtil.SNACCMAN_MOVE_SPEED;
    let next_y = current_y + this.snaccman.velocity[1]*GameUtil.SNACCMAN_MOVE_SPEED;
    
    const imgSize = GameUtil.IMG_SIZE;
    const offsetX = GameUtil.OFFSET_X_SIZE;
    const offsetY = GameUtil.OFFSET_Y_SIZE;
    const wallSize = 1/GameUtil.PIXEL_SIZE;

    const left = Math.floor(current_x + offsetX + wallSize);
    const top = Math.floor(current_y + offsetY + wallSize);
    const right = Math.floor(current_x + imgSize - offsetX + 2*wallSize);
    const bottom = Math.floor(current_y + imgSize - offsetY + 2*wallSize);

    const nextLeft = Math.floor(next_x + offsetX + wallSize);
    const nextTop = Math.floor(next_y + offsetY + wallSize);
    const nextRight = Math.floor(next_x + imgSize - offsetX + 2*wallSize);
    const nextBottom = Math.floor(next_y + imgSize - offsetY + 2*wallSize);
  
    //prevent movement if there is a wall
    if(nextLeft < left){ //Attempting to move left
      if (!this.getCell(left, top).canMoveLeft || !this.getCell(left, bottom).canMoveLeft) return false;
    }
    if(nextTop < top){ //Attempting to move up
      if (!this.getCell(left, top).canMoveUp || !this.getCell(right, top).canMoveUp) return false;
    }
    if (nextRight > right){ //Attempting to move right
      if (!this.getCell(right, top).canMoveRight || !this.getCell(right, bottom).canMoveRight) return false;
    }
    if (nextBottom > bottom){ //Attempting to move down
      if (!this.getCell(left, bottom).canMoveDown || !this.getCell(right, bottom).canMoveDown) return false;
    }
    this.snaccman.pos = [this.wrapX(next_x), this.wrapY(next_y)];
    return true;
  }

  wrapX(x){
    return ((x%this.grid.length) + this.grid.length)%this.grid.length;
  }
  wrapY(y){
    return ((y%this.grid[0].length) + this.grid[0].length)%this.grid[0].length;
  }
  getCell(x, y) {
    return this.grid[Math.floor(this.wrapX(x))][Math.floor(this.wrapY(y))];
  }

  checkCollisions(){

  }
  draw(){
    //clear canvas
    const gameWidth = GameUtil.GameWidth(this.grid);
    const gameHeight = GameUtil.GameHeight(this.grid);

    this.ctx.clearRect(0,0,gameWidth, gameHeight);
    this.ctx.fillRect(0,0,gameWidth, gameHeight);
    //cache the background after drawing it once so we don't have to look at ~900 cells every frame
    if(!this.cachedBackground){
      for(let x = 0; x < this.grid.length; x++){
        for(let y = 0; y < this.grid[x].length; y++){
          this.drawCell(x,y);
        }
      }
      this.ctx.stroke();
      this.cachedBackground = this.ctx.getImageData(0,0,gameWidth, gameHeight);
    }else{
      this.ctx.putImageData(this.cachedBackground,0,0);
    }
    
    //Draw pellets first so ghosts can draw over them

    /*for(let i = 0; i < this.pellets.length; i++ ){
      drawPellet(i);
    }*/

    this.drawSnaccman();

    /*for(let i = 0; i < this.ghosts.length; i++){
      drawGhost(i);
    }*/

    //clear the padding for wrapped images
    this.clearPadding();
    
  }

  clearPadding(){
    const gameWidth = GameUtil.GameWidth(this.grid);
    const padding = GameUtil.PADDING;
    const gameHeight = GameUtil.GameHeight(this.grid);
    const pixelSize = GameUtil.PIXEL_SIZE;
    //clear top padding
    this.ctx.fillRect(0, 0, gameWidth, padding);
    //clear left padding
    this.ctx.fillRect(0, 0, padding, gameHeight);
    //clear bottom padding
    this.ctx.fillRect(0, padding + (pixelSize * this.grid[0].length), gameWidth, padding);
    //clear right padding
    this.ctx.fillRect(padding + pixelSize * this.grid.length, 0, padding, gameHeight);
  }

  drawCell(x,y){
    const [x_start, y_start] = GameUtil.getStartPositionForCell(x,y);
    const [x_end, y_end] = GameUtil.getEndPositionForCell(x,y);
    //draw the walls if they can't move in that direction
    if(!this.grid[x][y].canMoveUp){
      this.ctx.moveTo(x_start, y_start);
      this.ctx.lineTo(x_end, y_start);
    }
    if(!this.grid[x][y].canMoveRight){
      this.ctx.moveTo(x_end, y_start);
      this.ctx.lineTo(x_end, y_end);
    }
    if(!this.grid[x][y].canMoveDown){
      this.ctx.moveTo(x_start, y_end);
      this.ctx.lineTo(x_end, y_end);
    }
    if(!this.grid[x][y].canMoveLeft){
      this.ctx.moveTo(x_start, y_start);
      this.ctx.lineTo(x_start, y_end);
    }
  }

  drawSnaccman(){

    //get position
    const [x_start, y_start] = GameUtil.getStartPositionForCell(...this.snaccman.pos);
    let direction = "right"; //default
    switch(this.snaccman.velocity.join(",")){
      case "1,0":
        direction = "right";
        break;
      case "-1,0":
        direction = "left";
        break;
      case "0,-1":
        direction = "up";
        break;
      case "0,1":
        direction = "down";
        break;
    }

    //sprite rotation = 0->1->0->2->repeat
    let imgNumber = 0;
    switch (Math.floor(this.frame / GameUtil.SPRITE_DURATION) % 4){
      case 0:
        imgNumber = 0;
        break;
      case 1:
        imgNumber = 1;
        break;
      case 2:
        imgNumber = 0;
        break;
      case 3:
        imgNumber = 2;
        break;
    }

    const img = GameUtil.IMAGES.snaccman[direction][imgNumber];

    //offset to center the image
    const imgSize = GameUtil.IMG_SIZE;
    const pixelSize = GameUtil.PIXEL_SIZE;
    const offsetX = GameUtil.SPRITE_OFFSET_X;
    const offsetY  = GameUtil.SPRITE_OFFSET_Y;
    
    this.ctx.drawImage(img, x_start, y_start);

    if(Math.ceil(this.snaccman.pos[0] + imgSize + offsetX) >= this.grid.length){
 
      this.ctx.drawImage(img, x_start - (this.grid.length * pixelSize) - imgSize, y_start);
    }
    if(Math.ceil(this.snaccman.pos[1] + imgSize + offsetY) >= this.grid[0].length){
      
      this.ctx.drawImage(img, x_start, y_start - (this.grid[0].length * pixelSize) - imgSize);
    }
    if ((Math.ceil(this.snaccman.pos[0] + imgSize + offsetX) >= this.grid.length) && (Math.ceil(this.snaccman.pos[1] + imgSize + offsetY) >= this.grid[0].length)) {

      this.ctx.drawImage(img, x_start - (this.grid.length * pixelSize) - imgSize, y_start - (this.grid[0].length * pixelSize) - imgSize);
    }
  }

  render(){
    return <canvas id="game-canvas" width={GameUtil.GameWidth(this.grid)} height={GameUtil.GameHeight(this.grid)}/>;
  }
}

export default Game;