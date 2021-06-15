import firebase from "firebase/app";
import { Projects } from "./application";


//Append to...
const container = document.querySelector('.login');
const loginBtns = document.querySelector('.loginBtns');
const loginInputField = document.querySelector('.loginInput');
const passwordInputField = document.querySelector('.passwordInput');

function createLoginForm() {
   
    (function emailInput() {
        const inputEmail = document.createElement('input');
        inputEmail.setAttribute('id', 'inputEmail'); 
        inputEmail.setAttribute('type', 'email');
        inputEmail.setAttribute('placeholder', 'Email');
        loginInputField.appendChild(inputEmail);
    })();

    (function passwordInput() {
        const inputPassword = document.createElement('input');
        inputPassword.setAttribute('id', 'inputPassword'); 
        inputPassword.setAttribute('type', 'password');
        inputPassword.setAttribute('placeholder', 'Password');
        passwordInputField.appendChild(inputPassword);
    })();

    (function buttons() {
        //Log in
        const loginButton = document.createElement('button');
        loginButton.setAttribute('id', 'loginButton');
        loginButton.innerText = "Log in";
        loginBtns.appendChild(loginButton);
        //Sign Up
        const signUpButton = document.createElement('button');
        signUpButton.setAttribute('id', 'signUpButton');
        signUpButton.innerText = "Sign Up";
        loginBtns.appendChild(signUpButton);
        //Log Out
        const logOutButton = document.createElement('button');
        logOutButton.setAttribute('id', 'logOutButton');
        logOutButton.innerText = "Log Out";
        logOutButton.style.display = "none";
        loginBtns.appendChild(logOutButton);
    })();
}

function getCredentialsAndLogin() {
    const inputEmail = document.querySelector('#inputEmail');
    const inputPassword = document.querySelector('#inputPassword');
    const loginButton = document.querySelector('#loginButton');
    const signUpButton = document.querySelector('#signUpButton');
    const logOutButton = document.querySelector('#logOutButton');

    //Login event
    loginButton.addEventListener('click', (e) => {
        
        //Get credentials
        const email = inputEmail.value; 
        const pass = inputPassword.value;
        const auth = firebase.auth();
        //Sign in
        const promise = auth.signInWithEmailAndPassword(email, pass)
        promise.catch(e => {
            if(e.message.match(/There is no user record/g)) {
                if(document.querySelector('#warningTxt')) {
                    container.removeChild(document.querySelector('#warningTxt'))
                }
                console.log('no user founds');
                const warningTxt = document.createElement('span');
                warningTxt.setAttribute('id', 'warningTxt');
                warningTxt.innerHTML = "<p style='color: red;'>User doesn't exist!</p>"
                container.appendChild(warningTxt);
            } else if(e.message.match(/The email address is badly/g)) {
                if(document.querySelector('#warningTxt')) {
                    container.removeChild(document.querySelector('#warningTxt'))
                }
                const warningTxt = document.createElement('span');
                warningTxt.setAttribute('id', 'warningTxt');
                warningTxt.innerHTML = "<p style='color: red;'>Please enter details!</p>"
                container.appendChild(warningTxt);
                console.log('bad email')
            } else if(e.message.match(/The password is invalid/g)) {
                if(document.querySelector('#warningTxt')) {
                    container.removeChild(document.querySelector('#warningTxt'))
                }
                const warningTxt = document.createElement('span');
                warningTxt.setAttribute('id', 'warningTxt');
                warningTxt.innerHTML = "<p style='color: red;'>Wrong email or password</p>"
                container.appendChild(warningTxt);
                console.log('bad email/password')
            } 
         })
    })
    //Sign Up event
    signUpButton.addEventListener('click', (e) => {
        const db = firebase.firestore();
        const email = inputEmail.value; 
        const pass = inputPassword.value;
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email, pass)
        promise.then(value => {
            return db.collection('userData').doc(value.user.uid).set({
                name: '',
                projectsNum: 0,
                projectsArr: [],
                numberOfTasks: 0
            })
        })
        //Set name in object
        promise.then(value => {
                let index = value.user.email.split('').findIndex((e, index) => e === '.' ||e === '@' ||e === '_');
                let name = value.user.email.substr(0, index).split('').map((e, index) => {
                    if(index === 0) {
                        return e.toUpperCase()
                    } else {
                        return e;
                    }
                }).join('');
                return db.collection('userData').doc(value.user.uid).update({
                    name: name,
                })
            
        })
        //Create default object
        promise.then(value => {
            const defaultProject = new Projects('default', 1, [], 0);
            db.collection('userData').doc(value.user.uid).update({
                projectsArr: firebase.firestore.FieldValue.arrayUnion(JSON.stringify(defaultProject)),
                projectsNum: firebase.firestore.FieldValue.increment(1),
            })

        })
        // promise.then(e => {
        //     setInterval(() => {
        //         location.reload();
        //     }, 1000)
        // })
        promise.catch(e => { 
        if(e.message.match(/Password should be/g)) {
            if(document.querySelector('#warningTxt')) {
                container.removeChild(document.querySelector('#warningTxt'))
            }
            const warningTxt = document.createElement('span');
            warningTxt.setAttribute('id', 'warningTxt');
            warningTxt.innerHTML = "<p style='color: red;'>A longer password please!</p>"
            container.appendChild(warningTxt);
            } else {
            if(document.querySelector('#warningTxt')) {
                container.removeChild(document.querySelector('#warningTxt'))
            } 
            const warningTxt = document.createElement('span');
            warningTxt.setAttribute('id', 'warningTxt');
            warningTxt.innerHTML = "<p style='color: red;'>User already exists!</p>"
            container.appendChild(warningTxt);
        }
        })
    })
    logOutButton.addEventListener('click', (e) => {
        firebase.auth().signOut();
    })
 
    //Listener login
    firebase.auth().onAuthStateChanged(user => {
        const db = firebase.firestore();
        if(user) {
            //Name before @
            
            document.querySelector('.login').style.display = "none";
            //Change msg
            if(document.querySelector('#warningTxt')) {
                container.removeChild(document.querySelector('#warningTxt'))
            }
            const infoTxt = document.createElement('span');
            infoTxt.setAttribute('id', 'infoTxt');
            //Set name
            db.collection('userData').doc(user.uid).get().then(doc => {
                infoTxt.innerHTML = `<p style='color: green;'>Welcome ${doc.data().name}!</p>`
                container.appendChild(infoTxt);
            })
            
        } else {
            document.querySelector('.login').style.display = "flex";
            inputEmail.value = "";
            inputPassword.value = "";
            //msg
            if(document.querySelector('#infoTxt')) {
                container.removeChild(document.querySelector('#infoTxt'))
            }
            console.log('not logged in');
        }
    });
}

export { createLoginForm, getCredentialsAndLogin }