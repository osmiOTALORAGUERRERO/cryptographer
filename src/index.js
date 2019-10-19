import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase';

firebase.initializeApp({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    authDomain: "criptografo-4365e.firebaseapp.com",
    databaseURL: "https://criptografo-4365e.firebaseio.com",
    projectId: "criptografo-4365e",
    storageBucket: "criptografo-4365e.appspot.com",
    messagingSenderId: "1067948575495",
    appId: "1:1067948575495:web:303045bac2bb92b8a013a2",
    measurementId: "G-79WZR9WPS2"
})

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
