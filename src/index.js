import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAkVSsAeGnUkex2LPbhNH3pvNRJ8vUtCZw",
  authDomain: "discgolfhub-5ba9c.firebaseapp.com",
  databaseURL: "https://discgolfhub-5ba9c.firebaseio.com",
  projectId: "discgolfhub-5ba9c",
  storageBucket: "discgolfhub-5ba9c.appspot.com",
  messagingSenderId: "774882122641",
  appId: "1:774882122641:web:c62bf19923e47e8cf81830",
  measurementId: "G-QY1LEE0KC7"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

