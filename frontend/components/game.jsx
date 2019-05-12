import React from "react";

import {BACKGROUND_COLOR, WALL_COLOR, WALL_SIZE, WALL_STROKE, FONT, FPS, MOVE_SPEED,
IMG_SIZE, PIXEL_SIZE, PADDING, TEXT_COLOR, IMAGES, SPRITE_DURATION, SPRITE_PIXEL_SIZE,
PELLET_COLOR, PELLET_SIZE, BIG_PELLET_SIZE } from "../util/constants";

import { GameUtil } from "../util/game_util";

import {BIG_PELLET} from "../../classes/Entity";

class Game extends React.Component{
  constructor(props){
    super(props);
    this.frame = 0;
    this.isBig = 0;
    this.lives = 3;

    this.snaccman = props.snaccman;
    // this.ghosts = props.ghosts;
    this.pellets = props.pellets;
    this.game = new GameUtil(props.grid);

    this.snaccman.bufferedVelocity = this.snaccman.velocity;

    this.nextFrame = this.nextFrame.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }
  componentDidMount(){
    //set up drawing context
    this.ctx = document.querySelector("#game-canvas").getContext("2d");
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.strokeStyle = WALL_COLOR;
    this.ctx.font = FONT;
    //load the image assets, start rendering once they are loaded
    this.game.loadImages(()=>{
      document.addEventListener("keydown", this.handleInput);
      this.intervalId = setInterval(this.nextFrame, 1000 / FPS);
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
        clearInterval(this.intervalId);
        document.removeEventListener("keydown", this.handleInput);
        break;
      case 38: //arrow up
      case 87: //W
        this.snaccman.bufferedVelocity = [0,-1];
        break;
      case 37: //arrow left
      case 65: //A
        this.snaccman.bufferedVelocity = [-1,0];
        break;
      case 40: //arrow down
      case 83: //S
        this.snaccman.bufferedVelocity = [0,1];
        break;
      case 39: //arrow right
      case 68: //D
        this.snaccman.bufferedVelocity = [1, 0];
        break;
    }
  }
  nextFrame() {
    this.frame += 1;
    if(this.isBig) this.isBig--;
    this.updatePositions();
    this.checkCollisions();
    this.draw();
  }

  updatePositions(){
    this.updateEntity(this.snaccman);
    
  }
  updateEntity(entity){
    //try the buffered velocity, and if it fails, keep moving in the previous direction
    entity.previousVelocity = entity.velocity;
    entity.velocity = entity.bufferedVelocity;
    const moved = this.updatePosition(entity);
    if(!moved && entity.velocity != entity.previousVelocity){
      entity.velocity = entity.previousVelocity;
      this.updatePosition(entity);
    }else{
      entity.bufferedVelocity = entity.velocity;
    }
  }

  
  updatePosition(entity){
    if(entity.velocity.join(",")==="0,0") return true; //stationary

    const [current_x, current_y] = entity.pos;
    const size = entity.size || IMG_SIZE;

    let next_x = current_x + entity.velocity[0]*MOVE_SPEED;
    let next_y = current_y + entity.velocity[1]*MOVE_SPEED;

    const left = Math.floor(current_x + WALL_SIZE);
    const top = Math.floor(current_y + WALL_SIZE);
    const right = (current_x + size + 2 * WALL_SIZE);
    const bottom = (current_y + size + 2 * WALL_SIZE);

    const nextLeft = Math.floor(next_x + WALL_SIZE);
    const nextTop = Math.floor(next_y + WALL_SIZE);
    const nextRight = Math.floor(next_x + size + 2*WALL_SIZE);
    const nextBottom = Math.floor(next_y + size + 2*WALL_SIZE);
  
    //prevent movement if there is a wall
    if(nextLeft < left){ //Attempting to move left
      if (!this.game.getTopLeftCell(entity).canMoveLeft() || !this.game.getBottomLeftCell(entity).canMoveLeft()) return false;
    }
    if(nextTop < top){ //Attempting to move up
      if (!this.game.getTopLeftCell(entity).canMoveUp() || !this.game.getTopRightCell(entity).canMoveUp()) return false;
    }
    if (nextRight > right){ //Attempting to move right
      if (!this.game.getTopRightCell(entity).canMoveRight() || !this.game.getBottomRightCell(entity).canMoveRight()) return false;
    }
    if (nextBottom > bottom){ //Attempting to move down
      if (!this.game.getBottomLeftCell(entity).canMoveDown() || !this.game.getBottomRightCell(entity).canMoveDown()) return false;
    }
    entity.pos = this.game.wrapPos([next_x, next_y]);
    return true;
  }

  checkCollisions(){
    this.pellets.forEach((pellet, i)=>{
      if(this.snaccman.collidesWith(pellet, this.grid)){
        console.log("Yum");
        if(pellet.type === BIG_PELLET) this.isBig = 60;
        delete this.pellets[i];
      }
    });
  }

  draw(){
    //clear canvas
    const gameWidth = this.game.GameWidth();
    const gameHeight = this.game.GameHeight();

    this.ctx.clearRect(0,0,gameWidth, gameHeight);
    this.ctx.fillRect(0,0,gameWidth, gameHeight);
    //cache the background after drawing it once so we don't have to look at ~900 cells every frame
    if(!this.cachedBackground){
      this.ctx.lineWidth = WALL_STROKE;
      for(let x = 0; x < this.game.getWidth(); x++){
        for(let y = 0; y < this.game.getHeight(); y++){
          this.drawCell(x,y);
        }
      }
      this.ctx.stroke();
      this.ctx.lineWidth = 1;
      this.cachedBackground = this.ctx.getImageData(0,0,gameWidth, gameHeight);
    }else{
      this.ctx.putImageData(this.cachedBackground,0,0);
    }
    
    //Draw pellets first so ghosts can draw over them

    this.drawPellets();

    this.drawSnaccman();

    /*for(let i = 0; i < this.ghosts.length; i++){
      drawGhost(i);
    }*/

    //clear the padding for wrapped images
    this.clearPadding();
    this.drawLives();
  }
  drawLives(){
    const bottom = this.game.GameHeight() - PADDING;
    const text = `Lives: ${this.lives}`;
    this.ctx.strokeStyle = TEXT_COLOR;
    this.ctx.fillStyle = TEXT_COLOR;
    this.ctx.fillText(text, PADDING, bottom + 25);
    this.ctx.strokeStyle = WALL_COLOR;
    this.ctx.fillStyle = BACKGROUND_COLOR;
  }

  clearPadding(){
    const gameWidth = this.game.GameWidth();
    const padding = PADDING;
    const gameHeight = this.game.GameHeight();
    const pixelSize = PIXEL_SIZE;
    //clear top padding
    this.ctx.fillRect(0, 0, gameWidth, padding);
    //clear left padding
    this.ctx.fillRect(0, 0, padding, gameHeight);
    //clear bottom padding
    this.ctx.fillRect(0, padding + (pixelSize * this.game.getHeight()), gameWidth, padding);
    //clear right padding
    this.ctx.fillRect(padding + pixelSize * this.game.getWidth(), 0, padding, gameHeight);
  }

  drawCell(x,y){
    const [x_start, y_start] = this.game.getStartPositionForCell(x,y);
    const [x_end, y_end] = this.game.getEndPositionForCell(x,y);
    //draw the walls if they can't move in that direction
    const cell = this.game.getCell(x,y);

    if(!cell.canMoveUp()){
      this.ctx.moveTo(x_start, y_start);
      this.ctx.lineTo(x_end, y_start);
    }
    if(!cell.canMoveRight()){
      this.ctx.moveTo(x_end, y_start);
      this.ctx.lineTo(x_end, y_end);
    }
    if(!cell.canMoveDown()){
      this.ctx.moveTo(x_start, y_end);
      this.ctx.lineTo(x_end, y_end);
    }
    if(!cell.canMoveLeft()){
      this.ctx.moveTo(x_start, y_start);
      this.ctx.lineTo(x_start, y_end);
    }
  }

  drawSnaccman(){

    //get position
    const [x_start, y_start] = this.game.getStartPositionForCell(...this.snaccman.pos);
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
    switch (Math.floor(this.frame / SPRITE_DURATION) % 4){
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

    const img = IMAGES.snaccman[direction][imgNumber];
    this.drawSprite(img, x_start, y_start, this.snaccman);
  }

  drawSprite(img, x, y, entity){
    const imgSize = IMG_SIZE;
    const pixelSize = PIXEL_SIZE;
    const spriteSize = SPRITE_PIXEL_SIZE;

    this.ctx.drawImage(img, x, y, spriteSize, spriteSize);
    if (Math.ceil(entity.pos[0] + imgSize) >= this.game.getWidth()) {
      this.ctx.drawImage(img, x - (this.game.getWidth() * pixelSize) - imgSize, y, spriteSize, spriteSize);
    }
    if (Math.ceil(entity.pos[1] + imgSize) >= this.game.getHeight()) {
      this.ctx.drawImage(img, x, y - (this.game.getHeight() * pixelSize) - imgSize, spriteSize, spriteSize);
    }
    if ((Math.ceil(entity.pos[0] + imgSize) >= this.game.getWidth()) && (Math.ceil(entity.pos[1] + imgSize) >= this.game.getHeight())) {
      this.ctx.drawImage(img, x - (this.game.getWidth() * pixelSize) - imgSize, y - (this.game.getHeight() * pixelSize) - imgSize, spriteSize, spriteSize);
    }
  }

  drawPellets(){
    this.ctx.fillStyle = PELLET_COLOR;
    this.ctx.strokeStyle = PELLET_COLOR;
    this.pellets.forEach(pellet => this.drawPellet(pellet));
    this.ctx.fill();
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.strokeStyle = WALL_COLOR;
  }
  
  drawPellet(pellet){
    const [x,y] = this.game.getStartPositionForCell(...pellet.pos);
    const offset = (PIXEL_SIZE / 2) - 1;
    this.ctx.moveTo(x + offset, y + offset);
    if(pellet.type === BIG_PELLET){
      this.ctx.arc(x+offset, y + offset, BIG_PELLET_SIZE, 0, 2*Math.PI);
    }else{
      this.ctx.arc(x + offset, y + offset, PELLET_SIZE, 0, 2 * Math.PI);
    }
  }

  render(){
    return <canvas id="game-canvas" width={this.game.GameWidth()} height={this.game.GameHeight()}/>;
  }
}

export default Game;