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
    // this.grid = props.grid;

    //temporary grid for testing
    this.grid = GameUtil.transposedTestGrid;

    this.nextFrame = this.nextFrame.bind(this);
  }
  componentDidMount(){
    this.ctx = document.querySelector("#game-canvas").getContext("2d");
    this.ctx.fillStyle = GameUtil.BACKGROUND_COLOR;
    this.ctx.strokeStyle = GameUtil.WALL_COLOR;
    this.timeout = setTimeout(this.nextFrame, 1000/GameUtil.FPS);
  }
  componentWillUnmount(){
    clearTimeout(this.timeout);
  }

  nextFrame() {
    this.frame += 1;
    this.updatePositions();
    this.checkCollisions();
    this.draw();
    if (!this.gameOver) this.timeout = setTimeout(this.nextFrame, 1000 / GameUtil.FPS);
  }

  updatePositions(){

  }
  checkCollisions(){

  }
  draw(){
    //clear canvas
    this.ctx.clearRect(0,0,GameUtil.GameWidth(this.grid), GameUtil.GameHeight(this.grid));
    this.ctx.fillRect(0,0,GameUtil.GameWidth(this.grid), GameUtil.GameHeight(this.grid));
    for(let x = 0; x < this.grid.length; x++){
      for(let y = 0; y < this.grid[x].length; y++){
        this.drawCell(x,y);
      }
    }
    
    //Draw pellets first so ghosts can draw over them

    /*for(let i = 0; i < this.pellets.length; i++ ){
      drawPellet(i);
    }*/

    //drawSnaccman();

    /*for(let i = 0; i < this.ghosts.length; i++){
      drawGhost(i);
    }*/
  }
  drawCell(x,y){
    const [x_start, y_start] = GameUtil.getStartPositionForCell(x,y);
    const [x_end, y_end] = GameUtil.getEndPositionForCell(x,y);

    //draw the walls if they can't move in that direction
    if(!this.grid[x][y].canMoveUp()){
      this.ctx.moveTo(x_start, y_start);
      this.ctx.lineTo(x_end, y_start);
      this.ctx.stroke();
    }
    if(!this.grid[x][y].canMoveRight()){
      this.ctx.moveTo(x_end, y_start);
      this.ctx.lineTo(x_end, y_end);
      this.ctx.stroke();
    }
    if(!this.grid[x][y].canMoveDown()){
      this.ctx.moveTo(x_start, y_end);
      this.ctx.lineTo(x_end, y_end);
      this.ctx.stroke();
    }
    if(!this.grid[x][y].canMoveLeft()){
      this.ctx.moveTo(x_start, y_start);
      this.ctx.lineTo(x_start, y_end);
      this.ctx.stroke();
    }
  }

  render(){
    return <canvas id="game-canvas" width={GameUtil.GameWidth(this.grid)} height={GameUtil.GameHeight(this.grid)}/>;
  }
}

export default Game;