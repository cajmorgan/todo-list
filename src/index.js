import firebase from "firebase/app";
import { executeFireBase, fireBaseAuth } from './firebase';
executeFireBase();


//Create Login Form
import{ createLoginForm, getCredentialsAndLogin } from './app/login';
createLoginForm();
getCredentialsAndLogin();

//If logged in 
firebase.auth().onAuthStateChanged(user => {
    if(user) {
        console.log('is working huh?');
    }
})

console.log('hello')