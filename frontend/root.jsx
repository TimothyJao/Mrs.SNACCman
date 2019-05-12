import ReactDOM from "react-dom";
import React from "react";
import Game from "./components/game";
import Grid from "../classes/Grid";
/* socket io */
//import socketIOClient from 'socket.io-client';

document.addEventListener("DOMContentLoaded",()=>{
  const grid = new Grid();
  ReactDOM.render(<Game grid={grid.getMoveGrid()}/>, document.querySelector("#root"));
});