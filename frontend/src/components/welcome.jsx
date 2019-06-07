import React from "react";
import { withRouter } from "react-router-dom";
import openSocket from "socket.io-client";
const production = "https://mrs-snaccman.herokuapp.com";
const development = "http://localhost:5000/";
export const url =
  process.env.NODE_ENV === "development" ? development : production;
export const socket = openSocket(url);


class Welcome extends React.Component {

  createLobby(){
    socket.emit('joinLobby', -1);
    this.props.history.push("/lobby");
  }

  joinLobby(){
    socket.emit('joinLobby', -1);
    this.props.history.push("/lobby");
  }

  render() {
    return (
      <div>
        <h1 style={{ color: "white" }}>Mrs.Snaccman</h1>
        <br/>
        <div className="img-header">
          <h2 style={{ color: "white" }}>
            {" "}
            <a href="#/game">
              {" "}<img className="header-img" src="images/right-1.png" /> Single Player {" "}
            </a>
          </h2>

          <h2 style={{ color: "white" }}>
            {" "}<img className="header-img" src="images/left-1.png" /> Join Random Lobby {" "}
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

export default withRouter(Welcome);
