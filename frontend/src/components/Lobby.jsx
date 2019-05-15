import React from 'react';
import openSocket from 'socket.io-client';
import {withRouter} from 'react-router-dom';
const production = 'https://mrs-snaccman.herokuapp.com';
const development = 'http://localhost:5000/';
export const url = ((process.env.NODE_ENV==='development') ? development : production);
export const socket = openSocket(url);

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            playerNumber: -1,
            players: "",
            endpoint: url 
        };
        this.playGame = this.playGame.bind(this);
    }

    componentDidMount() {
        socket.on('connectToRoom', (data) => {
            this.setState({ message: data.message, playerNumber: data.playerNumber})
        });

        socket.on('sendPlayers', (players) => {
            this.setState({ players: Object.keys(players) });
            this.props.history.push({ pathname: '/Game', state: { players: this.state.players, playerNumber: this.state.playerNumber } })
        })
    }

    playGame() {
        socket.emit('getPrompt', "")
    }

    render() {
   
        let startButton = this.state.playerNumber === 0 ? <button onClick={this.playGame} style={{ backgroundColor: 'white' }}> Start Game </button>: " ";

        return (
            <div>
                <h1 className="welcome" style={{color:'white'}}> Mrs. Snaccman </h1>
                <h1 style={{ color: 'white' }}> {this.state.message} </h1>
                {startButton}
            </div>
        );
    }
}

export default withRouter(Lobby);