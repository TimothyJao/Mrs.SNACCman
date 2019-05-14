import React from "react";
// import io from "socket.io-client"; 
// const socket = openSocket('http://localhost:5000');

import {BACKGROUND_COLOR, WALL_COLOR, WALL_FLASH_COLOR, WALL_FILL_FLASH_COLOR, WALL_SIZE, WALL_STROKE, FONT, FPS, MOVE_SPEED,
IMG_SIZE, PIXEL_SIZE, PADDING, TEXT_COLOR, IMAGES, SPRITE_DURATION, SPRITE_PIXEL_SIZE,
PELLET_COLOR, PELLET_SIZE, BIG_PELLET_SIZE, FONT_SMALL, ALT_PELLET_COLOR, WALL_FILL_COLOR, TEXT_OUTLINE_COLOR } from "../util/constants";

import { BIG_PELLET, PELLET, SNACCMAN, GHOST } from "../classes/Entity";

import { GameUtil, distance, shortestPath } from "../util/game_util";
// import Ghost from "../classes/Ghost";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.frame = 0;
    this.finished = false;
    this.isSuper = 0;
    this.score = 0;
    this.delay = 0;
    this.bonus = 3000;
    this.multiplier = 1;
    this.lives = 3;
    this.pelletCount = 999; // Needs to be > 1, gets reset when pellets are drawn
    this.start_position = [12.5, 22];
    this.respawn_location = [12, 10];
    this.ghostRegion = [[9, 11], [16, 15]];

    this.player = props.player || 0; //0 = pacman, 1-4 are ghosts

    this.waiting = true;
    this.loading = 3 * FPS;

    this.snaccman = props.snaccman;
    this.ghosts = props.ghosts;
    this.ghosts.forEach((ghost, i) => {
    ghost.bufferedVelocity = ghost.velocity;
      ghost.initialPos = ghost.pos;
      ghost.spawning = 2 * FPS * i;
    });
    this.pellets = props.pellets;
    this.game = new GameUtil(props.grid);

    this.snaccman.bufferedVelocity = this.snaccman.velocity;

    this.nextFrame = this.nextFrame.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.drawWinScreen = this.drawWinScreen.bind(this);
  }
  componentDidMount() {
    //set up drawing context
    this.ctx = document.querySelector("#game-canvas").getContext("2d");
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.strokeStyle = WALL_COLOR;
    this.ctx.font = FONT;
    //clear canvas
    this.ctx.clearRect(0, 0, this.game.GameWidth(), this.game.GameHeight());
    this.ctx.fillRect(0, 0, this.game.GameWidth(), this.game.GameHeight());
    //cache the background after drawing it once so we don't have to look at ~900 cells every frame
    this.ctx.lineWidth = WALL_STROKE;
    this.ctx.fillStyle = WALL_FILL_COLOR;
    for (let x = 0; x < this.game.getWidth(); x++) {
      for (let y = 0; y < this.game.getHeight(); y++) {
        this.drawCell(x, y);
      }
    }
    this.ctx.lineWidth = 1;
    this.cachedBackground = this.ctx.getImageData(0, 0, this.game.GameWidth(), this.game.GameHeight());

    //ghosts can only move up from their starting box
    for (let x = this.ghostRegion[0][0]; x <= this.ghostRegion[1][0]; ++x) {
      for (let y = this.ghostRegion[0][1]; y <= this.ghostRegion[1][1]; ++y) {
        this.game.grid[x][y].left = false;
        this.game.grid[x][y].right = false;
        this.game.grid[x][y].down = false;
      }
    }
    //load the image assets, start rendering once they are loaded
    this.game.loadImages(() => {
      document.addEventListener("keydown", this.handleInput);
      this.intervalId = setInterval(this.nextFrame, 1000 / FPS);
    });
  }
  componentWillUnmount() {
    //cleanup
    clearInterval(this.intervalId);
    document.removeEventListener("keydown", this.handleInput);
  }
  handleInput(e) {
    let entity;
    if (this.player === 0) {
      entity = this.snaccman;
    } else {
      entity = this.ghosts[this.player - 1];
    }
    switch (e.keyCode) {
      case 13://Enter begins the game
        if (this.waiting) {
          this.loading = 3 * FPS;
          this.waiting = false;
        } else if (this.loading) {
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
        entity.bufferedVelocity = [0, -1];
        break;
      case 37: //arrow left
      case 65: //A
        entity.bufferedVelocity = [-1, 0];
        break;
      case 40: //arrow down
      case 83: //S
        entity.bufferedVelocity = [0, 1];
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
      case 187: //+ wins the game for testing
        this.pellets.forEach((row, x) => {
          row.forEach((cell, y) => {
            if (cell !== undefined) delete this.pellets[x][y];
          });
        });
        this.pelletCount = 0;
        break;
    }
  }
  killSnaccman() {
    this.snaccman.pos = this.start_position;
    this.multiplier = 1;
    this.snaccman.velocity = [1, 0];
    this.snaccman.bufferedVelocity = [1, 0];
    this.frame = 0;
    this.ghosts.forEach((ghost, i) => {
      ghost.pos = ghost.initialPos;
      ghost.velocity = [0, -1];
      ghost.bufferedVelocity = [0, -1];
      ghost.spawning = 2 * FPS * i;
      ghost.dead = false;
    });
    this.isSuper = 0;
    if (this.lives > 0) this.lives--;
    this.loading = 3 * FPS;
  }
  nextFrame() {
    if (this.lives <= 0) {
      this.gameOver();
      return;
    }
    if (this.waiting) {
      this.draw();
      this.drawWaiting();
      return;
    }
    if (this.loading) {
      this.loading--;
      this.draw();
      this.drawLoading();
      return;
    }
    this.frame += 1;
    //display things if there isn't a delay
    if (!this.delay) {
      this.display = [];
      if(this.frame % FPS === 0) this.bonus -= 10;
      if (this.isSuper) {
        this.isSuper--;
        if (this.isSuper === 0) {
          this.multiplier = 1; //reset ghost multiplier
        }
      }
      this.updatePositions();
      this.checkCollisions();
      this.draw();
    } else {
      //display score popup over the ghost you just ate
      this.delay--;
      this.draw();
      this.drawScorePopup();
    }
    if (this.pelletCount === 0) {
      this.win();
    }
  }
  gameOver() {
    this.finished = true;
    this.draw();
    clearInterval(this.intervalId);
  }
  win() {
    this.frame = 0;
    this.score+=this.bonus;
    this.score+=1000*this.lives;
    this.finished = true;
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.drawWinScreen, 1000 / FPS);
  }

  updatePositions() {
    if (this.player !== 0) this.randomizeMovement(this.snaccman);
    this.updateEntity(this.snaccman);
    this.ghosts.forEach((ghost, i) => {
      if (this.player - 1 !== i) this.computeNextMove(ghost);
      if (ghost.spawning > 0) ghost.spawning--;
      if (ghost.spawning === 0 && (!this.isSuper || ghost.dead)) this.updateEntity(ghost);
      //only move ghosts half speed when in snacctime
      if (ghost.spawning === 0 && !ghost.dead && this.isSuper && this.frame % 2 === 0) this.updateEntity(ghost);
      //move ghost double speed when dead
      if (ghost.dead) {
        if (this.player - 1 !== i) this.computeNextMove(ghost);
        if (ghost.spawning > 0) ghost.spawning--;
        if (ghost.spawning === 0) this.updateEntity(ghost);
      }
    });
  }
  updateEntity(entity) {
    if(this.isSuper && this.inGhostRegion(entity)) return; //don't move respawned ghosts when super
    //try the buffered velocity, and if it fails, keep moving in the previous direction
    entity.previousVelocity = entity.velocity;
    entity.velocity = entity.bufferedVelocity;
    const moved = this.updatePosition(entity);
    if (!moved && entity.velocity != entity.previousVelocity) {
      entity.velocity = entity.previousVelocity;
      this.updatePosition(entity);
    } else {
      entity.bufferedVelocity = entity.velocity;
    }
  }


  updatePosition(entity) {
    if (entity.velocity.join(",") === "0,0") return true; //stationary

    const [current_x, current_y] = entity.pos;
    const size = entity.size || IMG_SIZE;

    let next_x = current_x + entity.velocity[0] * MOVE_SPEED;
    let next_y = current_y + entity.velocity[1] * MOVE_SPEED;

    const left = Math.floor(current_x + WALL_SIZE);
    const top = Math.floor(current_y + WALL_SIZE);
    const right = (current_x + size + 2 * WALL_SIZE);
    const bottom = (current_y + size + 2 * WALL_SIZE);

    const nextLeft = Math.floor(next_x + WALL_SIZE);
    const nextTop = Math.floor(next_y + WALL_SIZE);
    const nextRight = Math.floor(next_x + size + 2 * WALL_SIZE);
    const nextBottom = Math.floor(next_y + size + 2 * WALL_SIZE);

    //prevent movement if there is a wall
    if (nextLeft < left) { //Attempting to move left
      if (!this.game.getTopLeftCell(entity).canMoveLeft() || !this.game.getBottomLeftCell(entity).canMoveLeft()) return false;
    }
    if (nextTop < top) { //Attempting to move up
      if (!this.game.getTopLeftCell(entity).canMoveUp() || !this.game.getTopRightCell(entity).canMoveUp()) return false;
    }
    if (nextRight > right) { //Attempting to move right
      if (!this.game.getTopRightCell(entity).canMoveRight() || !this.game.getBottomRightCell(entity).canMoveRight()) return false;
    }
    if (nextBottom > bottom) { //Attempting to move down
      if (!this.game.getBottomLeftCell(entity).canMoveDown() || !this.game.getBottomRightCell(entity).canMoveDown()) return false;
    }
    entity.pos = this.game.wrapPos([next_x, next_y]);
    return true;
  }
  snaccTime(time = 5 * FPS) {
    this.isSuper = time;
  }

  randomizeMovement(entity) {
    if (this.frame % 20 !== 0) return;
    if (this.inGhostRegion(entity)) {
      entity.velocity = [0, -1];
      entity.bufferedVelocity = [0, -1];
      return;
    }
    const velocities = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0]];
    entity.bufferedVelocity = velocities[Math.floor(Math.random() * velocities.length)];
  }
  computeNextMove(ghost) {
    if (ghost.dead) {
      this.calculateRespawnPath(ghost);
    } else if (this.isSuper) {
      this.randomizeMovement(ghost); //move randomly if you are super
    } else {
      this.calculateShortestPath(ghost);
    }
  }
  checkCollisions() {
    const [start_x, start_y] = this.snaccman.pos;
    //center of snaccman to test eating
    const center = this.game.wrapPos([start_x + (IMG_SIZE / 2), start_y + (IMG_SIZE / 2)]);
    this.center = center;
    const cell = this.game.getCellAtPos(center);
    const pellet = this.pellets[cell.x][cell.y];

    if (pellet) {
      const pellet_pos = [pellet.pos[0] + 0.5, pellet.pos[1] + 0.5]; //pellet is centered
      if (pellet.type === BIG_PELLET) {
        if (distance(center, pellet_pos) < BIG_PELLET_SIZE / PIXEL_SIZE) {
          delete this.pellets[cell.x][cell.y];// = {type: "NOT_A_PELLET", pos: [0,0]};
          this.snaccTime();
          this.score += 10;
        }
      } else if (pellet.type === PELLET) {
        if (distance(center, pellet_pos) < PELLET_SIZE / PIXEL_SIZE) {
          delete this.pellets[cell.x][cell.y];// = { type: "NOT_A_PELLET", pos: [0, 0] };
          this.score += 10;
        }
      }
    }
    let killed = false;
    this.ghosts.forEach(ghost => {
      const [ghost_start_x, ghost_start_y] = ghost.pos;
      const ghostCenter = this.game.wrapPos([ghost_start_x + (IMG_SIZE / 2), ghost_start_y + (IMG_SIZE / 2)]);
      if (distance(center, ghostCenter) < IMG_SIZE) {
        if (ghost.dead) {
          //nothing, ghost is dead
        } else if (this.isSuper) {
          ghost.dead = true;
          this.delay = 0.75 * FPS;
          this.score += 200 * this.multiplier;
          this.display = [200 * this.multiplier, ghostCenter];
          this.multiplier *= 2;
        } else {
          if (!killed) this.killSnaccman(); //prevent multikill
          killed = true;
        }
      }
      if (ghost.dead && distance(ghostCenter, this.respawn_location) < IMG_SIZE) {
        if (this.game.getCellAtPos(this.respawn_location) == this.game.getCellAtPos(ghostCenter)) {
          ghost.dead = false;
          ghost.pos = ghost.initialPos;
          ghost.velocity = [0, -1];
          ghost.bufferedVelocity = [0, -1];
          ghost.spawning = 2 * FPS;
        }
      }
    });
  }
  calculateShortestPath(ghost) {
    const [start_x, start_y] = this.snaccman.pos;
    const snaccmanCenter = this.game.wrapPos([start_x + (IMG_SIZE / 2), start_y + (IMG_SIZE / 2)]);
    const [ghost_start_x, ghost_start_y] = ghost.pos;
    const ghostCenter = this.game.wrapPos([ghost_start_x + (IMG_SIZE / 2), ghost_start_y + (IMG_SIZE / 2)]);
    const snaccmanCell = this.game.getCellAtPos(snaccmanCenter);
    const ghostCell = this.game.getCellAtPos(ghostCenter);
    const path = shortestPath(snaccmanCell, ghostCell);

    if (path === undefined) return;
    const cell = path[ghostCell.toString()];

    let [ghostCellX, ghostCellY] = [ghostCell.x, ghostCell.y];
    if (this.game.getCell(ghostCellX + 1, ghostCellY) == cell) {
      ghost.bufferedVelocity = [1, 0];
    }
    if (this.game.getCell(ghostCellX - 1, ghostCellY) == cell) {
      ghost.bufferedVelocity = [-1, 0];
    }
    if (this.game.getCell(ghostCellX, ghostCellY + 1) == cell) {
      ghost.bufferedVelocity = [0, 1];
    }
    if (this.game.getCell(ghostCellX, ghostCellY - 1) == cell) {
      ghost.bufferedVelocity = [0, -1];
    }
  }
  calculateRespawnPath(ghost) {
    const [start_x, start_y] = this.respawn_location;
    const respawnCenter = this.game.wrapPos([start_x + (IMG_SIZE / 2), start_y + (IMG_SIZE / 2)]);
    const [ghost_start_x, ghost_start_y] = ghost.pos;
    const ghostCenter = this.game.wrapPos([ghost_start_x + (IMG_SIZE / 2), ghost_start_y + (IMG_SIZE / 2)]);
    const respawnCell = this.game.getCellAtPos(respawnCenter);
    const ghostCell = this.game.getCellAtPos(ghostCenter);
    const path = shortestPath(respawnCell, ghostCell);

    if (path === undefined) return;
    const cell = path[ghostCell.toString()];

    let [ghostCellX, ghostCellY] = [ghostCell.x, ghostCell.y];
    if (this.game.getCell(ghostCellX + 1, ghostCellY) == cell) {
      ghost.bufferedVelocity = [1, 0];
    }
    if (this.game.getCell(ghostCellX - 1, ghostCellY) == cell) {
      ghost.bufferedVelocity = [-1, 0];
    }
    if (this.game.getCell(ghostCellX, ghostCellY + 1) == cell) {
      ghost.bufferedVelocity = [0, 1];
    }
    if (this.game.getCell(ghostCellX, ghostCellY - 1) == cell) {
      ghost.bufferedVelocity = [0, -1];
    }
  }
  inGhostRegion(entity) {
    const [start_x, start_y] = this.ghostRegion[0];
    const [end_x, end_y] = this.ghostRegion[1];
    const [entity_start_x, entity_start_y] = entity.pos;
    const entityCenter = this.game.wrapPos([entity_start_x + (IMG_SIZE / 2), entity_start_y + (IMG_SIZE / 2)]);
    return (entityCenter[0] >= start_x && entityCenter[0] <= end_x &&
      entityCenter[1] >= start_y && entityCenter[1] <= end_y); //center of object is inside the range

  }

  draw() {
    //clear canvas
    const gameWidth = this.game.GameWidth();
    const gameHeight = this.game.GameHeight();

    this.ctx.clearRect(0, 0, gameWidth, gameHeight);
    this.ctx.fillRect(0, 0, gameWidth, gameHeight);
    //cache the background after drawing it once so we don't have to look at ~900 cells every frame
    if (!this.cachedBackground) {
      this.ctx.lineWidth = WALL_STROKE;
      this.ctx.fillStyle = WALL_FILL_COLOR;
      for (let x = 0; x < this.game.getWidth(); x++) {
        for (let y = 0; y < this.game.getHeight(); y++) {
          this.drawCell(x, y);
        }
      }
      this.ctx.fillStyle = BACKGROUND_COLOR;
      this.ctx.lineWidth = 1;
      this.cachedBackground = this.ctx.getImageData(0, 0, gameWidth, gameHeight);

    } else {
      this.ctx.putImageData(this.cachedBackground, 0, 0);
    }

    //Draw pellets first so ghosts can draw over them
    this.drawPellets();

    this.drawSnaccman();

    this.ghosts.forEach((ghost, idx) => this.drawGhost(ghost, idx));

    //clear the padding for wrapped images
    this.clearPadding();
    this.drawTop();
    this.drawBottom();
  }
  drawScorePopup() {

    const scoreText = this.display[0];
    let [center_x, center_y] = this.display[1];
    center_x *= PIXEL_SIZE;
    center_y *= PIXEL_SIZE;
    center_x += PADDING;
    center_y += PADDING;
    this.ctx.textAlign = "center";
    this.ctx.font = FONT_SMALL;
    this.ctx.beginPath();
    this.ctx.strokeStyle = TEXT_OUTLINE_COLOR;
    this.ctx.fillStyle = TEXT_COLOR;
    this.ctx.fillText(scoreText, center_x, center_y - 5);
    this.ctx.strokeText(scoreText, center_x, center_y - 5);
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.font = FONT;
    this.ctx.textAlign = "left";
    this.ctx.closePath();

  }
  drawTop(){
    const text = `Score: ${this.score}`;
    this.ctx.beginPath();
    this.ctx.strokeStyle = TEXT_OUTLINE_COLOR;
    this.ctx.fillStyle = TEXT_COLOR;
    this.ctx.fillText(text, PADDING + 1, 33);
    this.ctx.strokeText(text, PADDING + 1, 33);
    this.ctx.closePath();
    if(!this.finished){
      const text = `Bonus: ${this.bonus}`;
      this.ctx.beginPath();
      this.ctx.strokeStyle = TEXT_OUTLINE_COLOR;
      this.ctx.fillStyle = TEXT_COLOR;
      this.ctx.textAlign = "right";
      this.ctx.fillText(text, this.game.GameWidth() - PADDING - 1, 33);
      this.ctx.strokeText(text, this.game.GameWidth() - PADDING - 1, 33);
      this.ctx.textAlign = "left";
    }
    this.ctx.fillStyle = BACKGROUND_COLOR;
  }
  drawBottom(){
    const bottom = this.game.GameHeight() - PADDING;
    let text = (this.lives > 0) ? `Lives: ${this.lives}` : "GAME OVER!";
    if (this.lives > 0 && this.pelletCount === 0) {
      text = "WINNER!!!";
    }
    let rightText = "";
    if(this.isSuper && this.lives > 0 && this.pelletCount > 0){
      const SNACC_TIME = `${(1 + this.isSuper/FPS)}`.slice(0,1);
      rightText = `SNACC TIME!!! ${SNACC_TIME}`;
    }

    this.ctx.beginPath();
    this.ctx.strokeStyle = TEXT_OUTLINE_COLOR;
    this.ctx.fillStyle = TEXT_COLOR;
    this.ctx.fillText(text, PADDING + 1, bottom + 32);
    this.ctx.strokeText(text, PADDING + 1, bottom + 32);
    this.ctx.textAlign = "right";
    this.ctx.fillText(rightText, this.game.GameWidth() - PADDING - 1, bottom + 32);
    this.ctx.strokeText(rightText, this.game.GameWidth() - PADDING - 1, bottom + 32);
    this.ctx.textAlign = "left";
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.closePath();
  }
  drawWaiting() {
    const [x, y] = [PADDING / 2, this.game.GameHeight() / 2 - PADDING / 2];
    this.ctx.beginPath();
    this.ctx.strokeStyle = TEXT_COLOR;
    this.ctx.fillRect(x, y, this.game.GameWidth() - (PADDING), 50);
    this.ctx.strokeRect(x, y, this.game.GameWidth() - (PADDING), 50);
    this.ctx.fillStyle = TEXT_COLOR;
    this.ctx.strokeStyle = TEXT_OUTLINE_COLOR;
    this.ctx.textAlign = "center";
    this.ctx.fillText("Press ENTER to begin", this.game.GameWidth()/2, y+37);
    this.ctx.strokeText("Press ENTER to begin", this.game.GameWidth()/2, y+37);
    this.ctx.textAlign = "left";
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.closePath();
  }
  drawLoading() {
    const [x, y] = [PADDING / 2, this.game.GameHeight() / 2 - PADDING / 2];
    this.ctx.beginPath();
    this.ctx.strokeStyle = TEXT_COLOR;
    this.ctx.fillRect(x, y, this.game.GameWidth() - (PADDING), 50);
    this.ctx.strokeRect(x, y, this.game.GameWidth() - (PADDING), 50);
    this.ctx.fillStyle = TEXT_COLOR;
    this.ctx.strokeStyle = TEXT_OUTLINE_COLOR;
    this.ctx.textAlign = "center";
    const timer = (1 + this.loading / FPS).toString().slice(0, 1);
    const text = (this.lives === 3) ? `Beginning in ${timer}` : `Next round in ${timer}`;
    this.ctx.fillText(text, this.game.GameWidth()/2, y + 37);
    this.ctx.strokeText(text, this.game.GameWidth()/2, y + 37);
    this.ctx.textAlign = "left";
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.closePath();
  }

  clearPadding() {
    const gameWidth = this.game.GameWidth();
    const padding = PADDING;
    const gameHeight = this.game.GameHeight();
    const pixelSize = PIXEL_SIZE;
    this.ctx.fillStyle = BACKGROUND_COLOR;
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

  drawCell(x, y) {
    const [x_start, y_start] = this.game.getStartPositionForCell(x, y);
    const [x_end, y_end] = this.game.getEndPositionForCell(x, y);
    //draw the walls if they can't move in that direction
    const cell = this.game.getCell(x, y);

    if (!cell.canMoveUp()) {
      this.ctx.beginPath();
      this.ctx.moveTo(x_start, y_start);
      this.ctx.lineTo(x_end, y_start);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    if (!cell.canMoveRight()) {
      this.ctx.beginPath();
      this.ctx.moveTo(x_end, y_start);
      this.ctx.lineTo(x_end, y_end);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    if (!cell.canMoveDown()) {
      this.ctx.beginPath();
      this.ctx.moveTo(x_start, y_end);
      this.ctx.lineTo(x_end, y_end);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    if (!cell.canMoveLeft()) {
      this.ctx.beginPath();
      this.ctx.moveTo(x_start, y_start);
      this.ctx.lineTo(x_start, y_end);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    if(!cell.canMoveDown() && !cell.canMoveLeft() && !cell.canMoveUp() && !cell.canMoveRight()){
      this.ctx.beginPath();
      this.ctx.fillRect(x_start, y_start, x_end-x_start+2, y_end - y_start+2);
      this.ctx.closePath();
    }
  }

  drawSnaccman() {
    if (this.lives <= 0) return;
    //get position
    const [x_start, y_start] = this.game.getStartPositionForCell(...this.snaccman.pos);
    let direction = "right"; //default
    switch (this.snaccman.velocity.join(",")) {
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
    switch (Math.floor(this.frame / SPRITE_DURATION) % 4) {
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
  drawGhost(ghost, idx) { //idx = which color ghost
    const [x_start, y_start] = this.game.getStartPositionForCell(...ghost.pos);
    let img;

    if (ghost.dead) { //eyeball sprite if dead
      img = IMAGES.ghost.dead[0];
    } else if (this.isSuper) { //blue/white flashing ghost if snaccman is super
      const imgNumber = Math.floor(this.isSuper / (2 * SPRITE_DURATION)) % IMAGES.ghost.super.length;
      img = IMAGES.ghost.super[imgNumber];
    } else { //get the right color ghost
      img = IMAGES.ghost.color[idx];
    }
    this.drawSprite(img, x_start, y_start, ghost);
  }

  drawSprite(img, x, y, entity) {
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

  drawPellets() {
    
    this.pelletCount = 0;
    this.ctx.fillStyle = PELLET_COLOR;
    this.ctx.strokeStyle = PELLET_COLOR;
    this.pellets.forEach(pelletRow => pelletRow.forEach(pellet => this.drawPellet(pellet)));

    this.ctx.fillStyle = (this.frame / (4 * SPRITE_DURATION) % 2 < 1 ) ? PELLET_COLOR : ALT_PELLET_COLOR;
    this.pellets.forEach(pelletRow => pelletRow.forEach(pellet => this.drawBigPellet(pellet)));
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.strokeStyle = WALL_COLOR;

  }

  drawPellet(pellet) {
    if (!pellet || !pellet.type || (pellet.type !== PELLET)) return;
    this.pelletCount += 1;
    const [x, y] = this.game.getStartPositionForCell(...pellet.pos);
    const offset = (PIXEL_SIZE / 2) - 1;
    this.ctx.beginPath();
    this.ctx.moveTo(x + offset, y + offset);
    this.ctx.arc(x + offset, y + offset, PELLET_SIZE, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  
  }
  drawBigPellet(pellet){
    if (!pellet || !pellet.type || (pellet.type !== BIG_PELLET)) return;
    this.pelletCount += 1;
    const [x, y] = this.game.getStartPositionForCell(...pellet.pos);
    const offset = (PIXEL_SIZE / 2) - 1;
    this.ctx.beginPath();
    this.ctx.moveTo(x + offset, y + offset);
    this.ctx.arc(x + offset, y + offset, BIG_PELLET_SIZE, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }
  drawWinScreen() {
    this.frame++;
    if (this.frame > 1.25 * FPS) {
      clearInterval(this.intervalId);
      return;
    }
    //clear canvas
    const gameWidth = this.game.GameWidth();
    const gameHeight = this.game.GameHeight();
    this.ctx.fillStyle = BACKGROUND_COLOR;

    this.ctx.clearRect(0, 0, gameWidth, gameHeight);
    this.ctx.fillRect(0, 0, gameWidth, gameHeight);
    //cache the background after drawing it once so we don't have to look at ~900 cells every frame
    this.ctx.lineWidth = WALL_STROKE;
    this.ctx.strokeStyle = (this.frame * 2 % FPS < FPS / 2) ? WALL_FLASH_COLOR : WALL_COLOR;
    this.ctx.fillStyle = (this.frame * 2 % FPS < FPS / 2) ? WALL_FILL_FLASH_COLOR : WALL_FILL_COLOR;
    for (let x = 0; x < this.game.getWidth(); x++) {
      for (let y = 0; y < this.game.getHeight(); y++) {
        this.drawCell(x, y);
      }
    }
    this.ctx.lineWidth = 1;
    this.drawSnaccman();
    this.isSuper = false;

    this.ghosts.forEach((ghost, idx) => {
      ghost.dead = false;
      ghost.pos = ghost.initialPos;
      this.drawGhost(ghost, idx);
    
    });
    //clear the padding for wrapped images
    this.clearPadding();
    this.drawTop();
    this.drawBottom();
  }

  render() {
    return <canvas id="game-canvas" width={this.game.GameWidth()} height={this.game.GameHeight()} />;
  }
}

export default Game;