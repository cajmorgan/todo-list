import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

function executeFireBase() {
    const firebaseConfig = {
        apiKey: "AIzaSyD2efPlbpVUXjiZwDlTIhCXM_7yDQis4aQ",
        authDomain: "todo-list-34248.firebaseapp.com",
        databaseURL: "https://todo-list-34248-default-rtdb.firebaseio.com",
        projectId: "todo-list-34248",
        storageBucket: "todo-list-34248.appspot.com",
        messagingSenderId: "262465224521",
        appId: "1:262465224521:web:7e2707804d89a7e0dc6498",
        measurementId: "G-NS97GQYNJD"
    };

    firebase.initializeApp(firebaseConfig);
    const bigOne = document.querySelector('#bigOne');
    const dbRef = firebase.database().ref().child('text');
    dbRef.on('value', snap => bigOne.innerText = snap.val());
}

function fireBaseAuth() {
    const auth = firebase.auth();

}

export { executeFireBase, fireBaseAuth };