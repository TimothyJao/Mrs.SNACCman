import ReactDOM from "react-dom";
import React from "react";
import Game from "./components/game";

document.addEventListener("DOMContentLoaded",()=>{
  ReactDOM.render(<Game />, document.querySelector("#root"));
});