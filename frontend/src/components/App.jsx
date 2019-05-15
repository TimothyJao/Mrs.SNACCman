import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Game from './game';
import Lobby from "./Lobby";


const App = () => {
        
        return (
            
            <Switch>
                <Route exact path="/" component={Lobby}/>

                <Route exact path="/game" render={() => <Game />}/>
            </Switch>
        );
    }

export default App;