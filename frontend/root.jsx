import ReactDOM from "react-dom";
import React from "react";
import Game from "./components/game";
import Grid from "../classes/Grid";
import Snaccman from "../classes/Snaccman";
import { Entity, SNACCMAN, BIG_PELLET, PELLET} from "../classes/Entity";

document.addEventListener("DOMContentLoaded",()=>{
  const grid = new Grid();
  const snaccman = new Snaccman(12.5, 22, SNACCMAN, [1,0]);
  const pellets = [
    new Entity(0,0,PELLET),
    new Entity(1,0,BIG_PELLET),
  ];
  ReactDOM.render(<Game grid={grid.getMoveGrid()} snaccman={snaccman} pellets={pellets}/>, document.querySelector("#root"));
});