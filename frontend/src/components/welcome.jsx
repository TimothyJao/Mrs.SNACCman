import React from "react";
import { Link } from "react-router-dom";

class Welcome extends React.Component {
  render() {
    return (
      <div>
        <h1 style={{ color: "white" }}>Mrs.Snaccman</h1>
        <br />
        <div className="img-header">
          <h2 style={{ color: "white" }}>
            {" "}
            <a href="#/game">
              {" "}
              <img className="header-img" src="images/right-1.png" /> Single
              Player{" "}
            </a>
          </h2>

          <h2 style={{ color: "white" }}>
            {"  "}
            <img className="header-img" src="images/left-1.png" /> Join Random
            Lobby
          </h2>
          <h2 style={{ color: "white" }}>
            {" "}
            <img className="header-img" src="images/right-1.png" /> Join Lobby
            with ID
          </h2>
          <h2 style={{ color: "white" }}>
            {" "}
            <img className="header-img" src="images/left-1.png" /> Create Lobby
          </h2>
        </div>
      </div>
    );
  }
}

export default Welcome;
