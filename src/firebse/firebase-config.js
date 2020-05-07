import firebase from 'firebase/app'
import 'firebase/storage';

var config={
    apiKey: "AIzaSyB5ZXV32S2aeX6Q8eEUXbg2CVFB29SpB68",
    authDomain: "store-d3926.firebaseapp.com",
    databaseURL: "https://store-d3926.firebaseio.com",
    projectId: "store-d3926",
    storageBucket: "store-d3926.appspot.com",
    messagingSenderId: "413656806324",
    appId: "1:413656806324:web:32847d3168f0a3bf3678e1",
    measurementId: "G-R6785N09R1"
};

firebase.initializeApp(config);

const storage=firebase.storage();



export {
    storage,firebase as default 
}