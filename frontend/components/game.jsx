import React from "react";
// import io from "socket.io-client"; 
// const socket = openSocket('http://localhost:5000');

import {BACKGROUND_COLOR, WALL_COLOR, WALL_SIZE, WALL_STROKE, FONT, FPS, MOVE_SPEED,
IMG_SIZE, PIXEL_SIZE, PADDING, TEXT_COLOR, IMAGES, SPRITE_DURATION, SPRITE_PIXEL_SIZE,
PELLET_COLOR, PELLET_SIZE, BIG_PELLET_SIZE } from "../util/constants";

import {BIG_PELLET, PELLET, SNACCMAN, GHOST} from "../../classes/Entity";

import { GameUtil, distance } from "../util/game_util";
import Ghost from "../../classes/Ghost";

class Game extends React.Component{
  constructor(props){
    super(props);
    this.frame = 0;
    this.isSuper = 0;
    this.lives = 3;
    this.pelletCount = 999;
    this.start_position = [12.5, 22];

    this.player = props.player || 0; //0 = pacman, 1-4 are ghosts

    this.waiting = true;
    this.loading = 3*FPS;

    this.snaccman = props.snaccman;
    this.ghosts = props.ghosts;
    this.ghosts.forEach(ghost=>{ ghost.bufferedVelocity = ghost.velocity; });
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
    let entity;
    if (this.player === 0) {
      entity = this.snaccman;
    } else {
      entity = this.ghosts[this.player - 1];
    }
    switch(e.keyCode){
      case 13://Enter begins the game
        if(this.waiting){
          this.loading = 3*FPS;
          this.waiting = false;
        }else if(this.loading){
          this.loading = 0;
        }
        break;
      case 81: //q quits the game for testing
        console.log("Snaccman: ");
        console.log(this.snaccman);
        console.log("Center of snaccman: ");
        console.log(this.center);
        clearInterval(this.intervalId);
        document.removeEventListener("keydown", this.handleInput);
        break;
      case 80: //P enables super snacc thiccness mode for testing
        this.snaccTime();
        break;
      case 75: //K kills snaccman for testing
        this.killSnaccman();
        break;
      case 38: //arrow up
      case 87: //W
        entity.bufferedVelocity = [0,-1];
        break;
      case 37: //arrow left
      case 65: //A
        entity.bufferedVelocity = [-1,0];
        break;
      case 40: //arrow down
      case 83: //S
        entity.bufferedVelocity = [0,1];
        break;
      case 39: //arrow right
      case 68: //D
        entity.bufferedVelocity = [1, 0];
        break;
      case 49: //1 -> switch to snaccman
        this.player = 0;
        break;
      case 50: //2 -> switch to ghost 1
        this.player = 1;
        break;
      case 51: //3 -> switch to ghost 2
        this.player = 2;
        break;
      case 52: //4 -> switch to ghost 3
        this.player = 3;
        break;
      case 53: //5 -> switch to ghost 4
        this.player = 4;
        break;
    }
  }
  killSnaccman(){
    this.snaccman.pos = this.start_position;
    this.snaccman.velocity = [1,0];
    this.snaccman.bufferedVelocity = [1,0];
    this.isSuper = 0;
    if(this.lives > 0) this.lives--;
    this.loading = 3*FPS;
  }
  nextFrame() {
    if(this.lives <= 0){
      this.gameOver();
      return;
    }
    if(this.waiting){
      this.draw();
      this.drawWaiting();
      return;
    }
    if(this.loading){
      this.loading--;
      this.draw();
      this.drawLoading();
      return;
    }
    this.frame += 1;
    if(this.isSuper) this.isSuper--;
    this.updatePositions();
    this.checkCollisions();
    this.draw();
    if(this.pelletCount === 0){
      this.win();
    }
  }
  gameOver(){
    this.draw();
    clearInterval(this.intervalId);
  }
  win(){
    clearInterval(this.intervalId);
  }

  updatePositions(){
    this.updateEntity(this.snaccman);
    if(this.frame % 20 === 0) this.randomizeMovement(); //random movements
    this.ghosts.forEach(ghost=>this.computeNextMove(ghost));
    this.ghosts.forEach(ghost=>this.updateEntity(ghost));
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
  snaccTime(time = 5*FPS){
    this.isSuper = time;
  }

  randomizeMovement(){
    const velocities = [
      [0,1],
      [0,-1],
      [1,0],
      [-1,0]
    ];
    if(this.player!==0) this.snaccman.bufferedVelocity = velocities[Math.floor(Math.random() * velocities.length)];
    this.ghosts.forEach((ghost, i)=>{
      if(this.player - 1 === i) return;
      //if(ghost.dead || !this.isSuper) return; //only randomize when super
      ghost.bufferedVelocity = velocities[Math.floor(Math.random()*velocities.length)];
    });
  }
  computeNextMove(ghost){
    console.log(this.calculateShortestPath(ghost));
  }
  checkCollisions(){
    const [start_x, start_y] = this.snaccman.pos;
    //center of snaccman to test eating
    const center = this.game.wrapPos([start_x + (IMG_SIZE/2), start_y+(IMG_SIZE/2)]);
    this.center = center;
    const cell = this.game.getCellAtPos(center);
    const pellet = this.pellets[cell.x][cell.y];

    if (pellet) {
      const pellet_pos = [pellet.pos[0] + 0.5, pellet.pos[1] + 0.5]; //pellet is centered
      if (pellet.type === BIG_PELLET) {
        if (distance(center, pellet_pos) < BIG_PELLET_SIZE / PIXEL_SIZE) {
          delete this.pellets[cell.x][cell.y];// = {type: "NOT_A_PELLET", pos: [0,0]};
          this.snaccTime();
        }
      } else if (pellet.type === PELLET) {
        if (distance(center, pellet_pos) < PELLET_SIZE / PIXEL_SIZE) {
          delete this.pellets[cell.x][cell.y];// = { type: "NOT_A_PELLET", pos: [0, 0] };
        }
      }
    }
    let killed = false;
    this.ghosts.forEach(ghost=>{
      const [ghost_start_x, ghost_start_y] = ghost.pos;
      const ghostCenter = this.game.wrapPos([ghost_start_x + (IMG_SIZE / 2), ghost_start_y + (IMG_SIZE / 2)]);
      if(distance(center, ghostCenter) < IMG_SIZE){
        if(ghost.dead){
          //do nothing, ghost already dead
        }else if(this.isSuper){
          ghost.dead = true;
        }else{
          if(!killed) this.killSnaccman(); //prevent multikill
          killed=true;
        }
      }
    });
  }
  calculateShortestPath(ghost){
    const [start_x, start_y] = this.snaccman.pos;
    const snaccmanCenter = this.game.wrapPos([start_x + (IMG_SIZE / 2), start_y + (IMG_SIZE / 2)]);
    const [ghost_start_x, ghost_start_y] = ghost.pos;
    const ghostCenter = this.game.wrapPos([ghost_start_x + (IMG_SIZE / 2), ghost_start_y + (IMG_SIZE / 2)]);
    const snaccmanCell = this.game.getCellAtPos(snaccmanCenter);
    const ghostCell = this.game.getCellAtPos(ghostCenter);
    return ghost.shortestPathToSnacMan(this.game.getGrid(), { x: snaccmanCell.x, y: snaccmanCell.y }, { x: ghostCell.x, y: ghostCell.y });
  }

  draw(){
    //clear canvas
    const gameWidth = this.game.GameWidth();
    const gameHeight = this.game.GameHeight();

    this.ctx.clearRect(0,0,gameWidth, gameHeight);
    this.ctx.fillRect(0,0,gameWidth, gameHeight);
    //cache the background after drawing it once so we don't have to look at ~900 cells every frame
    if(!this.cachedBackground){
      this.ctx.beginPath();
      this.ctx.lineWidth = WALL_STROKE;
      for(let x = 0; x < this.game.getWidth(); x++){
        for(let y = 0; y < this.game.getHeight(); y++){
          this.drawCell(x,y);
        }
      }
      this.ctx.stroke();
      this.ctx.lineWidth = 1;
      this.ctx.closePath();
      this.cachedBackground = this.ctx.getImageData(0,0,gameWidth, gameHeight);
      
    }else{
      this.ctx.putImageData(this.cachedBackground,0,0);
    }
    
    //Draw pellets first so ghosts can draw over them
    this.drawPellets();

    this.drawSnaccman();

    this.ghosts.forEach((ghost, idx)=>this.drawGhost(ghost, idx));

    //clear the padding for wrapped images
    this.clearPadding();
    this.drawBottom();
  }
  drawBottom(){
    const bottom = this.game.GameHeight() - PADDING;
    let text = (this.lives > 0) ? `Lives: ${this.lives}` : "GAME OVER!";
    if(this.lives > 0 && this.pelletCount){
      text+= ` Left: ${this.pelletCount}`;
    }
    if(this.isSuper){
      const SNACC_TIME = `${(1 + this.isSuper/FPS)}`.slice(0,1);
      text += ` SNACC TIME!!! ${SNACC_TIME}`;
    }
    if(this.lives > 0 && this.pelletCount === 0){
      text = "WINNER!!!";
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = TEXT_COLOR;
    this.ctx.fillStyle = TEXT_COLOR;
    this.ctx.fillText(text, PADDING, bottom + 25);
    this.ctx.strokeStyle = WALL_COLOR;
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.closePath();

    
  }
  drawWaiting(){
    const [x,y] = [PADDING/2, this.game.GameHeight() / 2 - PADDING/2];
    this.ctx.beginPath();
    this.ctx.strokeStyle = TEXT_COLOR;
    this.ctx.fillRect(x,y,this.game.GameWidth()-(PADDING),50);
    this.ctx.strokeRect(x,y,this.game.GameWidth()-(PADDING),50);
    this.ctx.fillStyle = TEXT_COLOR;
    this.ctx.textAlign = "center";
    this.ctx.fillText("Press ENTER to begin", this.game.GameWidth()/2, y+30);
    this.ctx.textAlign = "left";
    this.ctx.strokeStyle = WALL_COLOR;
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.closePath();
  }
  drawLoading() {
    const [x, y] = [PADDING/2, this.game.GameHeight() / 2 - PADDING/2];
    this.ctx.beginPath();
    this.ctx.strokeStyle = TEXT_COLOR;
    this.ctx.fillRect(x, y, this.game.GameWidth() - (PADDING), 50);
    this.ctx.strokeRect(x, y, this.game.GameWidth() - (PADDING), 50);
    this.ctx.fillStyle = TEXT_COLOR;
    this.ctx.textAlign = "center";
    const timer = (1 + this.loading / FPS).toString().slice(0, 1);
    const text = (this.lives === 3) ? `Beginning in ${timer}` : `Next round in ${timer}`;
    this.ctx.fillText(text, this.game.GameWidth()/2, y + 30);
    this.ctx.textAlign = "left";
    this.ctx.strokeStyle = WALL_COLOR;
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.closePath();
  }

  clearPadding(){
    const gameWidth = this.game.GameWidth();
    const padding = PADDING;
    const gameHeight = this.game.GameHeight();
    const pixelSize = PIXEL_SIZE;
    //clear top padding
    this.ctx.beginPath();
    this.ctx.fillRect(0, 0, gameWidth, padding);
    //clear left padding
    this.ctx.fillRect(0, 0, padding, gameHeight);
    //clear bottom padding
    this.ctx.fillRect(0, padding + (pixelSize * this.game.getHeight()), gameWidth, padding);
    //clear right padding
    this.ctx.fillRect(padding + pixelSize * this.game.getWidth(), 0, padding, gameHeight);
    this.ctx.closePath();
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
    if(this.lives <= 0) return;
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

    const img = this.isSuper ? IMAGES.snaccman["super"][direction][imgNumber] : IMAGES.snaccman[direction][imgNumber];
    this.drawSprite(img, x_start, y_start, this.snaccman);
  }
  drawGhost(ghost, idx){ //idx = which color ghost
    const [x_start, y_start] = this.game.getStartPositionForCell(...ghost.pos);
    let img;

    if (ghost.dead) { //eyeball sprite if dead
      img = IMAGES.ghost.dead[0];
    }else if(this.isSuper){ //blue/white flashing ghost if snaccman is super
      const imgNumber = Math.floor(this.isSuper / (2*SPRITE_DURATION)) % IMAGES.ghost.super.length;
      img = IMAGES.ghost.super[imgNumber];
    }else{ //get the right color ghost
      img = IMAGES.ghost.color[idx];
    }
    this.drawSprite(img, x_start, y_start, ghost);
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
    this.ctx.beginPath();
     
    this.ctx.fillStyle = PELLET_COLOR;
    this.ctx.strokeStyle = PELLET_COLOR;
    this.pellets.forEach(pelletRow => pelletRow.forEach(pellet => this.drawPellet(pellet)));
    this.ctx.fill();
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.strokeStyle = WALL_COLOR;
    this.ctx.closePath();
  }
  
  drawPellet(pellet){
    if(!pellet || !pellet.type || (pellet.type !== BIG_PELLET && pellet.type!== PELLET)) return;
    this.pelletCount+=1;
    const [x,y] = this.game.getStartPositionForCell(...pellet.pos);
    const offset = (PIXEL_SIZE / 2) - 1;
    this.ctx.moveTo(x + offset, y + offset);
    if(pellet.type === BIG_PELLET){
      this.ctx.arc(x+offset, y + offset, BIG_PELLET_SIZE, 0, 2*Math.PI);
    }else if(pellet.type === PELLET){
      this.ctx.arc(x + offset, y + offset, PELLET_SIZE, 0, 2 * Math.PI);
    }
  }

  render(){
    return <canvas id="game-canvas" width={this.game.GameWidth()} height={this.game.GameHeight()}/>;
  }
}

export default Game;