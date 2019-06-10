import React from "react";
import { url } from './welcome'
import { withRouter } from "react-router-dom";
import { socket } from "./welcome"

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            playerNumber: -1,
            players: "",
            endpoint: url,
            roomIdMessage: ""
        };
        this.playGame = this.playGame.bind(this);
    }

    componentDidMount() {
      socket.on('connectToRoom', (data) => {
          this.setState({ message: data.message, playerNumber: data.playerNumber, roomIdMessage: data.roomIdMessage })
      });

      socket.on("sendPlayers", players => {
        this.setState({ players: Object.keys(players) });
        this.props.history.push({pathname: "/Game", state: {players: this.state.players, playerNumber: this.state.playerNumber}});
      });
    }

    playGame() {
      socket.emit('getPrompt', "")
    }

    render() {
        let startButton = this.state.playerNumber === 0 ? <button className="start-btn" onClick={this.playGame}> Start Game </button>: " ";
        return (
            <div>
                <h1 className="welcome" style={{color:'white'}}> Mrs. Snaccman </h1>
                <div className="lobbyMessages">
                    <h1 className="message"> {this.state.message} </h1>
                    <h1 className="message"> {this.state.roomIdMessage} </h1>
                </div>
                    
                <div className="button-fix">
                    {startButton}
                </div>
            </div>
        );
    }
}

export default withRouter(Lobby);
