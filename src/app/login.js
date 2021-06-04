import firebase from "firebase/app";
import "firebase/auth";

//Append to...
const container = document.querySelector('.container')

function createLoginForm() {
    (function emailInput() {
        const inputEmail = document.createElement('input');
        inputEmail.setAttribute('id', 'inputEmail'); 
        inputEmail.setAttribute('type', 'email');
        inputEmail.setAttribute('placeholder', 'Email');
        container.appendChild(inputEmail);
    })();

    (function passwordInput() {
        const inputPassword = document.createElement('input');
        inputPassword.setAttribute('id', 'inputPassword'); 
        inputPassword.setAttribute('type', 'password');
        inputPassword.setAttribute('placeholder', 'Password');
        container.appendChild(inputPassword);
    })();

    (function buttons() {
        //Log in
        const loginButton = document.createElement('button');
        loginButton.setAttribute('id', 'loginButton');
        loginButton.innerText = "Log in";
        container.appendChild(loginButton);
        //Sign Up
        const signUpButton = document.createElement('button');
        signUpButton.setAttribute('id', 'signUpButton');
        signUpButton.innerText = "Sign Up";
        container.appendChild(signUpButton);
        //Log Out
        const logOutButton = document.createElement('button');
        logOutButton.setAttribute('id', 'logOutButton');
        logOutButton.innerText = "Log Out";
        logOutButton.style.display = "none";
        container.appendChild(logOutButton);
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
        console.log('fire!');
        const auth = firebase.auth();
        //Sign in
        const promise = auth.signInWithEmailAndPassword(email, pass)
        promise.catch(e => {
            if(e.message.match(/There is no user record/g)) {
                if(document.querySelector('#warningTxt')) {
                    container.removeChild(document.querySelector('#warningTxt'))
                }
                console.log('no user found');
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
            console.log(e.message) })
    })
    //Sign Up event
    signUpButton.addEventListener('click', (e) => {
        const email = inputEmail.value; 
        const pass = inputPassword.value;
        console.log('SignUp!');
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email, pass)
        promise.catch(e => { 
            if(document.querySelector('#warningTxt')) {
                container.removeChild(document.querySelector('#warningTxt'))
            }
            const warningTxt = document.createElement('span');
            warningTxt.setAttribute('id', 'warningTxt');
            warningTxt.innerHTML = "<p style='color: red;'>User already exists!</p>"
            container.appendChild(warningTxt);
            console.log(e.message);
        })
    })
    logOutButton.addEventListener('click', (e) => {
        firebase.auth().signOut();
    })
 
    //Listener login
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            //Name before @
            let index = user.email.split('').findIndex((e, index) => e === '@');
            let name = user.email.substr(0, index).split('').map((e, index) => {
                if(index === 0) {
                    return e.toUpperCase()
                } else {
                    return e;
                }
            }).join('');

            logOutButton.style.display = "initial";
            loginButton.style.display = "none";
            signUpButton.style.display = "none";
            inputEmail.style.display = "none";
            inputPassword.style.display = "none";
            //Change msg
            if(document.querySelector('#warningTxt')) {
                container.removeChild(document.querySelector('#warningTxt'))
            }
            const infoTxt = document.createElement('span');
            infoTxt.setAttribute('id', 'infoTxt');
            infoTxt.innerHTML = `<p style='color: green;'>Welcome ${name}!</p>`
            container.appendChild(infoTxt);
            console.log(user)
        } else {
            logOutButton.style.display = "none";
            loginButton.style.display = "initial";
            signUpButton.style.display = "initial";
            inputEmail.style.display = "initial";
            inputPassword.style.display = "initial";
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


function createSignUpForm() {
    
}

export { createLoginForm, getCredentialsAndLogin }