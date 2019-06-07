import React from "react";

class Welcome extends React.Component {
  constructor(props){
    super(props);
    this.state = {lobbyId: 1000};
    this.singlePlayer = this.singlePlayer.bind(this);
    this.randomLobby = this.randomLobby.bind(this);
    this.joinLobby = this.joinLobby.bind(this);
    this.createLobby = this.createLobby.bind(this);
  }
  singlePlayer(e){
    e.preventDefault();
    this.props.history.push("/game");
  }
  randomLobby(e){
    e.preventDefault();
    this.props.history.push("/game");
  }
  joinLobby(e){
    e.preventDefault();
    console.log(this.state.lobbyId);
    this.props.history.push("/game");
  }
  createLobby(e){
    e.preventDefault();
    this.props.history.push("/game");
  }
  render() {
    return (
      <div id="welcome">
        <h1>Mrs.Snaccman</h1>
        <ul>
          <li onClick={this.singlePlayer}><img src="images/right-1.png" />Single Player</li>
          <li onClick={this.createLobby}><img src="images/left-1.png" />Create Lobby</li>
          <li onClick={this.randomLobby}><img src="images/left-1.png" />Join Random Lobby</li>
          <li onClick={this.joinLobby}><img src="images/right-1.png" />
            Join Lobby with ID
            <input type="number" id="lobby-id" value={this.state.lobbyId} onClick={e=>e.stopPropagation()} onChange={(e)=>{
              e.preventDefault();
              e.stopPropagation();
              this.setState({lobbyId: e.target.value});
              }}/>
          </li>
        </ul>
      </div>
    );
  }
}

export default Welcome;
