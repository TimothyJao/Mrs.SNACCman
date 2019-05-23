import React from "react";
import ReactDOM from "react-dom";

import Game from "./components/game";

document.addEventListener("DOMContentLoaded",()=>{
  //currentPlayer: 0 = snaccman, 1-4 = ghosts; if omitted, will default to snaccman
  //numberOfPlayers: How many players are playing, the rest will be AI controlled; will default to 1 if ommitted
  ReactDOM.render(
    <Game currentPlayer={0} numberOfPlayers={1} />,
    document.querySelector("#root")
  );
});