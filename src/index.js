import firebase from "firebase/app";
import { executeFireBase, fireBaseAuth } from './firebase';
executeFireBase();


//Create Login Form
import{ createLoginForm, getCredentialsAndLogin } from './app/login';
createLoginForm();
getCredentialsAndLogin();

//If logged in 
import { createUI, getProjects, loadProjects, Projects } from "./app/application";
firebase.auth().onAuthStateChanged(user => {
    if(user) {
        createUI();
        getProjects();
    }
    else {
        document.querySelector('.container').style.display = "none";
    }
})
