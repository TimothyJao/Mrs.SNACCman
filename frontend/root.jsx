import ReactDOM from "react-dom";
import React from "react";
import Game from "./components/game";
import Grid from "./classes/Grid";
/* socket io */
//import socketIOClient from 'socket.io-client';
import Snaccman from "./classes/Snaccman";
import Ghost from "./classes/Ghost";

import { Entity, SNACCMAN, BIG_PELLET, PELLET, GHOST} from "./classes/Entity";

document.addEventListener("DOMContentLoaded",()=>{
  const grid = new Grid();
  const snaccman = new Snaccman(12.5, 22, SNACCMAN, [1,0]);
  const ghosts = [
    new Ghost(12, 12, GHOST, [0,-1]),
    new Ghost(12, 13, GHOST, [0,-1]),
    new Ghost(13, 12, GHOST, [0,-1]),
    new Ghost(13, 13, GHOST, [0,-1])
  ];
  ReactDOM.render(<Game grid={grid.getMoveGrid()} ghosts={ghosts} snaccman={snaccman} pellets={grid.getPelletGrid()}/>, document.querySelector("#root"));
});