import React from "react";
import { Switch, Route } from "react-router-dom";
import Game from "./game";
import Lobby from "./Lobby";
import Welcome from "./welcome";

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route exact path="/lobby" component={Lobby} />
      <Route exact path="/game" render={() => <Game />} />
    </Switch>
  );
};

export default App;
