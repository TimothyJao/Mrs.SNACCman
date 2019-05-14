import React from 'react';
import socketIOClient from 'socket.io-client';
import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:5000');

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",

            role: false,
            endpoint: "http://localhost:5000"
        };
    }

    componentDidMount() {
        const socket = socketIOClient(this.state.endpoint);
        socket.on('connectToRoom', (message) => {
            this.setState({ message })
        });
    }
    

    render() {
        return (
            <div>
                <h1 style={{color:'white'}}> Welcome </h1>
                <h1 style={{ color: 'white' }}> {this.state.message} </h1>
        
            </div>
        );
    }
}

export default Lobby;