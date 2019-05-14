import React from 'react';
import socketIOClient from 'socket.io-client';
import { emit } from 'cluster';
import openSocket from 'socket.io-client';
import {Link} from 'react-router-dom';
// const socket = openSocket('http://localhost:5000');

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            playerNumber: -1,
            endpoint: "http://localhost:5000"
        };
        this.playGame = this.playGame.bind(this);
    }

    componentDidMount() {
        const socket = socketIOClient(this.state.endpoint);
        socket.on('connectToRoom', (data) => {
            this.setState({ message: data.message, playerNumber: data.playerNum})
        });
    
    }

    playGame() {
        //const socket = socketIOClient(this.state.endpoint);
        socket.emit('getPrompt').on('sendPlayers',  (players) => {
            debugger;
        });
    }

    render() {
   
        let startButton = this.state.playerNumber === 0 ? <Link to="/game"><button onClick={this.playGame} style={{ backgroundColor: 'white' }}> Start Game </button></Link> : " ";
        // let startButton = null;
        // if (this.state.playerNumber === 0) {
        //     startButton = <button> Start Game </button>
        // } else {
        //     startButton = "";
        // }
        return (
            <div>
                <h1 style={{color:'white'}}> Welcome </h1>
                <h1 style={{ color: 'white' }}> {this.state.message} </h1>
                {startButton}
            </div>
        );
    }
}

export default Lobby;