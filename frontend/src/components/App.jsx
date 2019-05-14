import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Game from './game';
import Grid from "../classes/Grid";

import Snaccman from "../classes/Snaccman";
import Ghost from "../classes/Ghost";
import {GHOST, SNACCMAN} from "../classes/Entity";


const App = () => {
        const grid = new Grid();
        const snaccman = new Snaccman(12.5, 22, SNACCMAN, [1, 0]);
        const ghosts = [
            new Ghost(12, 12, GHOST, [0, -1]),
            new Ghost(12, 13, GHOST, [0, -1]),
            new Ghost(13, 12, GHOST, [0, -1]),
            new Ghost(13, 13, GHOST, [0, -1])
        ];
        return (
            <Switch>
            
                <Route exact path="/game" render={() => <Game grid={grid.getMoveGrid()} ghosts={ghosts} snaccman={snaccman} pellets={grid.getPelletGrid()} />}/>
            </Switch>
        );
    }

export default App;