import ReactDOM from "react-dom";
import React from "react";
import Game from "./components/game";
import Grid from "../classes/Grid";
/* socket io */
//import socketIOClient from 'socket.io-client';
import Snaccman from "../classes/Snaccman";
import { Entity, SNACCMAN, BIG_PELLET, PELLET} from "../classes/Entity";

document.addEventListener("DOMContentLoaded",()=>{
  const grid = new Grid();
  const snaccman = new Snaccman(12.5, 22, SNACCMAN, [1,0]);
  ReactDOM.render(<Game grid={grid.getMoveGrid()} snaccman={snaccman} pellets={grid.getPelletGrid()}/>, document.querySelector("#root"));
});