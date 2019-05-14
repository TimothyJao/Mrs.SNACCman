import React from 'react';
import socketIOClient from 'socket.io-client';

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
    }
    

    render() {
        const socket = socketIOClient(this.state.endpoint);
        socket.on('connectToRoom', (message) => {
            this.setState({ message })
        });
        return (
            <div>
                
                <h1 style={{color:'white'}}> Welcome </h1>
                <h1 style={{ color: 'white' }}> {this.state.message} </h1>
                
            </div>
        );
    }
}

export default Lobby;