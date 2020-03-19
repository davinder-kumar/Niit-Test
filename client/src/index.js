import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
import { BrowserRouter } from 'react-router-dom'
const endpoint = "http://127.0.0.1:8080"
const socket = io.connect(endpoint);


ReactDOM.render(
    <BrowserRouter>
        <SocketProvider socket={socket}>
            <App />
        </SocketProvider>
    </BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
