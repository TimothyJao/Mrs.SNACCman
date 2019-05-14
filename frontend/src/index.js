import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';
import Root from './components/Root';
import store from './store/store';
import configureStore from './store/store';


// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

document.addEventListener("DOMContentLoaded", () => {
    // const grid = new Grid();
    // const snaccman = new Snaccman(12.5, 22, SNACCMAN, [1, 0]);
    // const ghosts = [
    //     new Ghost(12, 12, GHOST, [0, -1]),
    //     new Ghost(12, 13, GHOST, [0, -1]),
    //     new Ghost(13, 12, GHOST, [0, -1]),
    //     new Ghost(13, 13, GHOST, [0, -1])
    // ];
    const store = configureStore({});
    ReactDOM.render(<Root store={store}/>, document.querySelector("#root"));
    serviceWorker.unregister();
});
