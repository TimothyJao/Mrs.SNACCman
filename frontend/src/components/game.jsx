import React from "react";
import { withRouter } from 'react-router-dom';
import {BACKGROUND_COLOR, WALL_COLOR, WALL_FLASH_COLOR, WALL_FILL_FLASH_COLOR, WALL_SIZE, WALL_STROKE, FONT, FPS, MOVE_SPEED,
IMG_SIZE, PIXEL_SIZE, PADDING, TEXT_COLOR, IMAGES, SPRITE_DURATION, SPRITE_PIXEL_SIZE,
PELLET_COLOR, PELLET_SIZE, BIG_PELLET_SIZE, FONT_SMALL, ALT_PELLET_COLOR, WALL_FILL_COLOR, TEXT_OUTLINE_COLOR } from "../util/constants";
import {url} from './Lobby'
import { BIG_PELLET, PELLET, SNACCMAN, GHOST } from "../classes/Entity";
import Grid from "../classes/Grid";
import Ghost from "../classes/Ghost";
import Snaccman from "../classes/Snaccman";
import { GameUtil, distance, shortestPath, random } from "../util/game_util";
// import openSocket from 'socket.io-client';
import {socket} from "./Lobby";
// const socket = openSocket('http://localhost:5000');

const UP = [0,-1];
const DOWN = [0,1];
const LEFT = [-1, 0];
const RIGHT = [1, 0];

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.setupNewGame();
    this.state = {
      endpoint: url
    };
    this.scaleCanvas = this.scaleCanvas.bind(this);
  }

  receiveData(data) {
    if(this.numberOfPlayers === 1) return; //no sockets on single player
    clearInterval(this.intervalId);
    let lag = this.frame - data.frame;
    // lag = Math.abs(lag)
    const player = data.player;
    const entity = data.entity;
    if(player === 0){
      this.snaccman.pos = entity.pos;
      this.snaccman.bufferedVelocity = entity.bufferedVelocity;
      this.snaccman.velocity = entity.velocity;
    }else{
      this.ghosts[player - 1].pos = entity.pos;
      this.ghosts[player - 1].bufferedVelocity = entity.bufferedVelocity;
      this.ghosts[player - 1].velocity = entity.velocity;
    }
    while(lag > 0){
      this.updateEntity(entity);
      this.checkCollisions();
      lag--;
    }
    this.intervalId = setInterval(this.nextFrame, 1000 / FPS);
  } 

  sendData(entity) {
    if(this.numberOfPlayers === 1) return; //no sockets on single player
    const data = { frame: this.frame, entity, player: this.currentPlayer };
    socket.emit('getPlayer', data);
  }

  setupNewGame(){
    //initialize new game variables to default states
    const grid = new Grid();
    this.frame = 0;
    this.finished = false;
    this.isSuper = 0;
    this.score = 0;
    this.delay = 0;
    this.bonus = 3000;
    this.multiplier = 1;
    this.lives = 3;
    this.pelletCount = 1; // Needs to be >= 1, gets reset when pellets are drawn
    this.startPosition = [12.5, 22];
    this.respawnLocation = [12, 10];
    this.ghostRegion = [[9, 11], [16, 15]];

    this.currentPlayer = this.props.currentPlayer || 0; //0 = pacman, 1-4 are ghosts
    if(this.props.location && this.props.location.state && this.props.location.state.playerNumber) this.currentPlayer = this.props.location.state.playerNumber;
    this.numberOfPlayers = this.props.numberOfPlayers || 1;
    if(this.props.location && this.props.location.state && this.props.location.state.players) this.numberOfPlayers = this.props.location.state.players.length;
    
    if(this.numberOfPlayers === 1){
      this.waiting = true;
      this.loading = 3*FPS;
    }else{
      this.waiting = false;
      this.loading = 5 * FPS;
    }

    this.snaccman = new Snaccman(...this.startPosition, SNACCMAN, RIGHT);
    this.ghosts = [
      new Ghost(12, 12, GHOST, UP),
      new Ghost(12, 13, GHOST, UP),
      new Ghost(13, 12, GHOST, UP),
      new Ghost(13, 13, GHOST, UP)
    ];
    this.ghosts.forEach((ghost, i) => {
      ghost.bufferedVelocity = ghost.velocity;
      ghost.initialPos = ghost.pos;
      ghost.spawning = 2 * FPS * i;
      ghost.ai = (i >= this.numberOfPlayers - 1 );
    });
    if(this.numberOfPlayers > 1){
      for(let i = this.numberOfPlayers - 1; i < 5; i++){
        delete this.ghosts[i];
      }
    }
    this.pellets = grid.getPelletGrid();
    this.game = new GameUtil(grid.getMoveGrid());

    this.snaccman.bufferedVelocity = this.snaccman.velocity;

    this.nextFrame = this.nextFrame.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.drawWinScreen = this.drawWinScreen.bind(this);
  }
  componentDidMount() {
    //set up drawing context
    const canvas = document.querySelector("#game-canvas");
    this.scaleCanvas();
    window.addEventListener("resize",this.scaleCanvas);
    this.ctx = canvas.getContext("2d");
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

    socket.on('getPlayerData', (data) => {
      this.receiveData(data);
    });
  }
  componentWillUnmount() {
    //cleanup
    clearInterval(this.intervalId);
    document.removeEventListener("keydown", this.handleInput);
    window.removeEventListener("resize", this.scaleCanvas);
  }
  scaleCanvas(){
    const canvas = document.querySelector("#game-canvas");
    const WIDTH = this.game.GameWidth();
    const HEIGHT = this.game.GameHeight();
    const scale = Math.min(window.innerHeight / HEIGHT, window.innerWidth / WIDTH) ;
    canvas.style.cssText = `width: ${WIDTH * scale}px; height: ${HEIGHT * scale}px;`;
  }
  handleInput(e) {
    let entity;
    if (this.currentPlayer === 0) {
      entity = this.snaccman;
    } else {
      entity = this.ghosts[this.currentPlayer - 1];
    }
    switch (e.keyCode) {
        case 13://Enter begins the game
        if(this.numberOfPlayers !== 1) return;
        if (this.waiting) {
          this.loading = 3 * FPS;
          this.waiting = false;
        }else if(this.loading > 0){
          this.loading = 0;
        }
        break;
      // case 80: //P enables super snacc thiccness mode for testing
      //   this.snaccTime();
      //   break;
      // case 75: //K kills snaccman for testing
      //   this.killSnaccman();
      //   break;
      case 38: //arrow up
      case 87: //W
        entity.bufferedVelocity = UP;
        this.sendData(entity);
        break;
      case 37: //arrow left
      case 65: //A
        entity.bufferedVelocity = LEFT;
        this.sendData(entity);
        break;
      case 40: //arrow down
      case 83: //S
        entity.bufferedVelocity = DOWN;
        this.sendData(entity);
        break;
      case 39: //arrow right
      case 68: //D
        entity.bufferedVelocity = RIGHT;
        this.sendData(entity);
        break;
      // case 49: //1 -> switch to snaccman
      //   this.currentPlayer = 0;
      //   break;
      // case 50: //2 -> switch to ghost 1
      //   this.currentPlayer = 1;
      //   break;
      // case 51: //3 -> switch to ghost 2
      //   this.currentPlayer = 2;
      //   break;
      // case 52: //4 -> switch to ghost 3
      //   this.currentPlayer = 3;
      //   break;
      // case 53: //5 -> switch to ghost 4
      //   this.currentPlayer = 4;
      //   break;
      // case 187: //+ wins the game for testing
      //   this.pellets.forEach((row, x) => {
      //     row.forEach((cell, y) => {
      //       if (cell !== undefined) delete this.pellets[x][y];
      //     });
      //   });
      //   this.pelletCount = 0;
      //   break;
      default:
        break;
    }
  }
  killSnaccman() {
    this.snaccman.pos = this.startPosition;
    this.multiplier = 1;
    this.snaccman.velocity = RIGHT;
    this.snaccman.bufferedVelocity = RIGHT;
    this.frame = 0;
    this.ghosts.forEach((ghost, i) => {
      ghost.pos = ghost.initialPos;
      ghost.velocity = UP;
      ghost.bufferedVelocity = UP;
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
      this.bonus = Math.max(this.bonus, 0); //Cap at 0
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
    //if (this.currentPlayer !== 0) this.randomizeMovement(this.snaccman);
    this.updateEntity(this.snaccman);
    this.ghosts.forEach((ghost, i) => {
      if (ghost.dead || this.currentPlayer - 1 !== i) this.computeNextMove(ghost);
      if (ghost.spawning > 0) ghost.spawning--;
      if (ghost.spawning === 0 && (!this.isSuper || ghost.dead)) this.updateEntity(ghost);
      //only move ghosts half speed when in snacctime
      if (ghost.spawning === 0 && !ghost.dead && this.isSuper && this.frame % 2 === 0) this.updateEntity(ghost);
      //move ghost double speed when dead
      if (ghost.dead) {
        if (ghost.dead || this.currentPlayer - 1 !== i) this.computeNextMove(ghost);
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
    if (!moved && entity.velocity !== entity.previousVelocity) {
      entity.velocity = entity.previousVelocity;
      this.updatePosition(entity);
    } else {
      entity.bufferedVelocity = entity.velocity;
    }
  }


  updatePosition(entity) {
    if (entity.velocity.join(",") === "0,0") return true; //stationary

    const [currentX, currentY] = entity.pos;
    const size = entity.size || IMG_SIZE;

    let nextX = currentX + entity.velocity[0] * MOVE_SPEED;
    let nextY = currentY + entity.velocity[1] * MOVE_SPEED;

    const left = Math.floor(currentX + WALL_SIZE);
    const top = Math.floor(currentY + WALL_SIZE);
    const right = (currentX + size + 2 * WALL_SIZE);
    const bottom = (currentY + size + 2 * WALL_SIZE);

    const nextLeft = Math.floor(nextX + WALL_SIZE);
    const nextTop = Math.floor(nextY + WALL_SIZE);
    const nextRight = Math.floor(nextX + size + 2 * WALL_SIZE);
    const nextBottom = Math.floor(nextY + size + 2 * WALL_SIZE);

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
    entity.pos = this.game.wrapPos([nextX, nextY]);
    return true;
  }
  snaccTime(time = 5 * FPS) {
    this.isSuper = time;
  }

  randomizeMovement(entity) {
    if (this.frame % 20 !== 0) return;
    if (this.inGhostRegion(entity)) {
      entity.velocity = UP;
      entity.bufferedVelocity = UP;
      return;
    }
    const velocities = [
      DOWN,
      UP,
      LEFT,
      RIGHT
    ];
    entity.bufferedVelocity = velocities[Math.floor(random(this.frame*entity.pos[0]) * velocities.length)];
  }
  computeNextMove(ghost) {
    if(!ghost.ai && !ghost.dead) return;
    if (ghost.dead) {
      this.calculateRespawnPath(ghost);
    } else if (this.isSuper) {
      this.randomizeMovement(ghost); //move randomly if you are super
    } else {
      this.calculateShortestPath(ghost);
    }
  }
  checkCollisions() {
    const [startX, startY] = this.snaccman.pos;
    //center of snaccman to test eating
    const center = this.game.wrapPos([startX + (IMG_SIZE / 2), startY + (IMG_SIZE / 2)]);
    this.center = center;
    const cell = this.game.getCellAtPos(center);
    const pellet = this.pellets[cell.x][cell.y];

    if (pellet) {
      const pelletPos = [pellet.pos[0] + 0.5, pellet.pos[1] + 0.5]; //pellet is centered
      if (pellet.type === BIG_PELLET) {
        if (distance(center, pelletPos) < BIG_PELLET_SIZE / PIXEL_SIZE) {
          delete this.pellets[cell.x][cell.y];
          this.snaccTime();
          this.score += 10;
        }
      } else if (pellet.type === PELLET) {
        if (distance(center, pelletPos) < PELLET_SIZE / PIXEL_SIZE) {
          delete this.pellets[cell.x][cell.y];
          this.score += 10;
        }
      }
    }
    let killed = false;
    this.ghosts.forEach(ghost => {
      const [ghostStartX, ghostStartY] = ghost.pos;
      const ghostCenter = this.game.wrapPos([ghostStartX + (IMG_SIZE / 2), ghostStartY + (IMG_SIZE / 2)]);
      if (distance(center, ghostCenter) < IMG_SIZE - 2*MOVE_SPEED) {
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
      if (ghost.dead && distance(ghostCenter, this.respawnLocation) < IMG_SIZE - 2*MOVE_SPEED) {
        if (this.game.getCellAtPos(this.respawnLocation) === this.game.getCellAtPos(ghostCenter)) {
          ghost.dead = false;
          ghost.pos = ghost.initialPos;
          ghost.velocity = UP;
          ghost.bufferedVelocity = UP;
          ghost.spawning = 2 * FPS;
        }
      }
    });
  }
  calculateShortestPath(ghost) {
    const [startX, startY] = this.snaccman.pos;
    const snaccmanCenter = this.game.wrapPos([startX + (IMG_SIZE / 2), startY + (IMG_SIZE / 2)]);
    const [ghostStartX, ghostStartY] = ghost.pos;
    const ghostCenter = this.game.wrapPos([ghostStartX + (IMG_SIZE / 2), ghostStartY + (IMG_SIZE / 2)]);
    const snaccmanCell = this.game.getCellAtPos(snaccmanCenter);
    const ghostCell = this.game.getCellAtPos(ghostCenter);
    const path = shortestPath(snaccmanCell, ghostCell);

    if (path === undefined) return;
    const cell = path[ghostCell.toString()];

    let [ghostCellX, ghostCellY] = [ghostCell.x, ghostCell.y];
    if (this.game.getCell(ghostCellX + 1, ghostCellY) === cell) {
      ghost.bufferedVelocity = RIGHT;
    }
    if (this.game.getCell(ghostCellX - 1, ghostCellY) === cell) {
      ghost.bufferedVelocity = LEFT;
    }
    if (this.game.getCell(ghostCellX, ghostCellY + 1) === cell) {
      ghost.bufferedVelocity = DOWN;
    }
    if (this.game.getCell(ghostCellX, ghostCellY - 1) === cell) {
      ghost.bufferedVelocity = UP;
    }
  }
  calculateRespawnPath(ghost) {
    const [startX, startY] = this.respawnLocation;
    const respawnCenter = this.game.wrapPos([startX + (IMG_SIZE / 2), startY + (IMG_SIZE / 2)]);
    const [ghostStartX, ghostStartY] = ghost.pos;
    const ghostCenter = this.game.wrapPos([ghostStartX + (IMG_SIZE / 2), ghostStartY + (IMG_SIZE / 2)]);
    const respawnCell = this.game.getCellAtPos(respawnCenter);
    const ghostCell = this.game.getCellAtPos(ghostCenter);
    const path = shortestPath(respawnCell, ghostCell);

    if (path === undefined) return;
    const cell = path[ghostCell.toString()];

    let [ghostCellX, ghostCellY] = [ghostCell.x, ghostCell.y];
    if (this.game.getCell(ghostCellX + 1, ghostCellY) === cell) {
      ghost.bufferedVelocity = RIGHT;
    }
    if (this.game.getCell(ghostCellX - 1, ghostCellY) === cell) {
      ghost.bufferedVelocity = LEFT;
    }
    if (this.game.getCell(ghostCellX, ghostCellY + 1) === cell) {
      ghost.bufferedVelocity = DOWN;
    }
    if (this.game.getCell(ghostCellX, ghostCellY - 1) === cell) {
      ghost.bufferedVelocity = UP;
    }
  }
  inGhostRegion(entity) {
    const [startX, startY] = this.ghostRegion[0];
    const [endX, endY] = this.ghostRegion[1];
    const [entityStartX, entityStartY] = entity.pos;
    const entityCenter = this.game.wrapPos([entityStartX + (IMG_SIZE / 2), entityStartY + (IMG_SIZE / 2)]);
    return (entityCenter[0] >= startX && entityCenter[0] <= endX &&
      entityCenter[1] >= startY && entityCenter[1] <= endY); //center of object is inside the range

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
    let [centerX, centerY] = this.display[1];
    centerX *= PIXEL_SIZE;
    centerY *= PIXEL_SIZE;
    centerX += PADDING;
    centerY += PADDING;
    this.ctx.textAlign = "center";
    this.ctx.font = FONT_SMALL;
    this.ctx.beginPath();
    this.ctx.strokeStyle = TEXT_OUTLINE_COLOR;
    this.ctx.fillStyle = TEXT_COLOR;
    this.ctx.fillText(scoreText, centerX, centerY - 5);
    this.ctx.strokeText(scoreText, centerX, centerY - 5);
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
    const [xStart, yStart] = this.game.getStartPositionForCell(x, y);
    const [xEnd, yEnd] = this.game.getEndPositionForCell(x, y);
    //draw the walls if they can't move in that direction
    const cell = this.game.getCell(x, y);

    if (!cell.canMoveUp()) {
      this.ctx.beginPath();
      this.ctx.moveTo(xStart, yStart);
      this.ctx.lineTo(xEnd, yStart);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    if (!cell.canMoveRight()) {
      this.ctx.beginPath();
      this.ctx.moveTo(xEnd, yStart);
      this.ctx.lineTo(xEnd, yEnd);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    if (!cell.canMoveDown()) {
      this.ctx.beginPath();
      this.ctx.moveTo(xStart, yEnd);
      this.ctx.lineTo(xEnd, yEnd);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    if (!cell.canMoveLeft()) {
      this.ctx.beginPath();
      this.ctx.moveTo(xStart, yStart);
      this.ctx.lineTo(xStart, yEnd);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    if(!cell.canMoveDown() && !cell.canMoveLeft() && !cell.canMoveUp() && !cell.canMoveRight()){
      this.ctx.beginPath();
      this.ctx.fillRect(xStart, yStart, xEnd-xStart+2, yEnd - yStart+2);
      this.ctx.closePath();
    }
  }

  drawSnaccman() {
    if (this.lives <= 0) return;
    //get position
    const [xStart, yStart] = this.game.getStartPositionForCell(...this.snaccman.pos);
    let direction = "right"; //default
    switch (this.snaccman.velocity.join(",")) {
      case RIGHT.join(","):
        direction = "right";
        break;
      case LEFT.join(","):
        direction = "left";
        break;
      case UP.join(","):
        direction = "up";
        break;
      case DOWN.join(","):
        direction = "down";
        break;
      default:
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
      default:
        break;
    }

    const img = this.isSuper ? IMAGES.snaccman["super"][direction][imgNumber] : IMAGES.snaccman[direction][imgNumber];
    this.drawSprite(img, xStart, yStart, this.snaccman);
  }
  drawGhost(ghost, idx) { //idx = which color ghost
    const [xStart, yStart] = this.game.getStartPositionForCell(...ghost.pos);
    let img;

    if (ghost.dead) { //eyeball sprite if dead
      img = IMAGES.ghost.dead[0];
    } else if (this.isSuper) { //blue/white flashing ghost if snaccman is super
      const imgNumber = Math.floor(this.isSuper / (2 * SPRITE_DURATION)) % IMAGES.ghost.super.length;
      img = IMAGES.ghost.super[imgNumber];
    } else { //get the right color ghost
      img = IMAGES.ghost.color[idx];
    }
    this.drawSprite(img, xStart, yStart, ghost);
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
// export default Game;
export default withRouter(Game);