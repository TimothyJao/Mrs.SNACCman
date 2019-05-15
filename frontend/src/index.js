import React from 'react';
import ReactDOM from 'react-dom';
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
    const store = configureStore({});
    ReactDOM.render(<Root store={store}/>, document.querySelector("#root"));
    serviceWorker.unregister();
});
