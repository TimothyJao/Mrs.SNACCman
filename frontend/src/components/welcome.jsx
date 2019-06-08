import React from "react";
import { withRouter } from "react-router-dom";
import openSocket from "socket.io-client";
const production = "https://mrs-snaccman.herokuapp.com";
const development = "http://localhost:5000/";
export const url =
  process.env.NODE_ENV === "development" ? development : production;
export const socket = openSocket(url);


class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lobbyId: 1000, found: false };
    this.singlePlayer = this.singlePlayer.bind(this);
    this.randomLobby = this.randomLobby.bind(this);
    this.joinLobby = this.joinLobby.bind(this);
    this.createLobby = this.createLobby.bind(this);
  }
  singlePlayer(e) {
    e.preventDefault();
    this.props.history.push("/game");
  }
  randomLobby(e) {
    e.preventDefault();
    socket.emit('joinLobby', -2)
  }
  joinLobby(e) {
    e.preventDefault();
    socket.emit('joinLobby', this.state.lobbyId)
  }
  createLobby(e) {
    e.preventDefault();
    socket.emit('joinLobby', -1)
  }

  componentDidMount() {
    socket.on('lobbyFound', found => {
      if (found) { this.props.history.push("/lobby");}
    });
  }

  render() {
    return (
      <div id="welcome">
        <h1>Mrs.Snaccman</h1>
        <ul>
          <li onClick={this.singlePlayer}><img src="images/right-1.png" />Single Player</li>
          <li onClick={this.createLobby}><img src="images/left-1.png" />Create Lobby</li>
          <li onClick={this.randomLobby}><img src="images/right-1.png" />Join Random Lobby</li>
          <li className="not-pointer"><img src="images/left-1.png" />
            Join Lobby with ID
            <div id="welcome-input">
              <input type="number" id="lobby-id" 
              value={this.state.lobbyId}
              onChange={(e)=>{
                e.preventDefault();
                this.setState({lobbyId: e.target.value});
              }}/>
              <button onClick={this.joinLobby}>Join</button>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(Welcome);

