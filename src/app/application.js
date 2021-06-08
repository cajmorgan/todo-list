import firebase from "firebase/app";

//Global Arrays
let globalProjectArr = [];
let globalTaskArr = [];

const container = document.querySelector('.container')
function createUI() {
    container.style.display = "flex";
    const db = firebase.firestore();
    const user = firebase.auth().currentUser;
    (function header() {
        if(document.querySelector('header')) {
            container.removeChild(document.querySelector('header'))
        }   
            //Get username from db and create header
            
            db.collection('userData').doc(user.uid).get().then(doc => {
                const header = document.createElement('header');
                header.innerHTML = `<div class="headerLeft"><h1>To-Do List</h1><h2>Your tasks!</div><div class="headerRight"><p>Welcome ${doc.data().name}!</p><button id="logOutBtnHeader">Log Out</button></div>`
                container.appendChild(header);
                //Log out button
                const logOutBtnHeader = document.querySelector('#logOutBtnHeader');
                logOutBtnHeader.addEventListener('click', (e) => {
                firebase.auth().signOut();
            })
        })  
    })();
    (function createPanelSidebar() {
        if(document.querySelector('main')) {
            container.removeChild(document.querySelector('main'))
        }  
            db.collection('userData').doc(user.uid).get().then(doc => {
                const mainAndSidebar = document.createElement('main');
                container.appendChild(mainAndSidebar)
                const sideBar = document.createElement('aside');
                sideBar.innerHTML = "<h2>Projects</h2>"
                mainAndSidebar.appendChild(sideBar)
            })
    })();
    

    (function createTaskArea() {
            db.collection('userData').doc(user.uid).get().then(doc => {
                const section = document.createElement('section');
                section.innerHTML = "<h2>Tasks</h2>"
                const mainAndSidebar = document.querySelector('main');
                mainAndSidebar.appendChild(section)
            })
    })();

}

class Projects {
    constructor(name, projectID, tasks, numberOfTasks) {
        this.name = name;
        this.projectID = projectID;
        this.tasks = tasks;
        this.numberOfTasks = numberOfTasks;
    }
}

function createNewProject(name, id) {
    //Pop-up Project Name
    (function createNewProjectPopUp() {
        const sideBar = document.querySelector('aside');
        if(document.querySelector('.newProjectPopUp')) {
            sideBar.removeChild(document.querySelector('.newProjectPopUp'))
        }
        const newProjectPopUp = document.createElement('div');
        newProjectPopUp.classList.add('newProjectPopUp');
        newProjectPopUp.innerHTML = `<h3>Name: </h3><input class="newProjectName" type="text" placeholder="Project Name"></input><i id="saveProjectBtn" class="fas fa-save"></i>`
        sideBar.insertBefore(newProjectPopUp, document.querySelector('.newProjectBtn'));
        //Add event listener to Save Project button
        const saveProjectBtn = document.querySelector('#saveProjectBtn');
        saveProjectBtn.addEventListener('click', createProjectObject);
    })();

    //Create object
    function createProjectObject() {
        //Get Firestore
        const db = firebase.firestore();
        const user = firebase.auth().currentUser;

        const newProject = new Projects(name, id, [], 0)
        globalProjectArr.push(newProject);
        console.log(globalProjectArr);
        //Put JSON object into database
        db.collection('userData').doc(user.uid).update({
            projectsArr: firebase.firestore.FieldValue.arrayUnion(JSON.stringify(newProject)),
            projectsNum: firebase.firestore.FieldValue.increment(1),
        })
    }
}

function getProjects(){
    //Get projects from DB and push to globalProjectArr
    globalProjectArr = [];
    const db = firebase.firestore();
    const user = firebase.auth().currentUser;
    db.collection('userData').doc(user.uid).get().then((doc) => {
        for(let i = 0; i < doc.data().projectsArr.length; i++) {
            globalProjectArr.push(JSON.parse(doc.data().projectsArr[i]));
            console.log(globalProjectArr)
            createProjectsFromLoad();
           
        }
    })
}

function createProjectsFromLoad() {
    const sideBar = document.querySelector('aside');
    for(let i = 0; i < globalProjectArr.length; i++) {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('projects');
        projectDiv.setAttribute('id', `${globalProjectArr[i].projectID}`)
        projectDiv.innerHTML = `<h3>Name: ${globalProjectArr[i].name}</h3><h4>Tasks: ${globalProjectArr[i].tasks.length}</h4><i class="fas fa-times"></i></i>`
        sideBar.appendChild(projectDiv);
        
    }

    newProjectButton();
    console.log('load it!')
}

//Create newProject Button after load
function newProjectButton() {
    const mainAndSidebar = document.querySelector('aside');
    if(document.querySelector('.newProjectBtn')) {
        mainAndSidebar.removeChild(document.querySelector('.newProjectBtn'))
    }
    const newProjectBtn = document.createElement('div');
    newProjectBtn.classList.add('newProjectBtn');
    newProjectBtn.innerHTML = '<i class="fas fa-plus-circle"></i><h3>Create New Project</h3>'
    mainAndSidebar.appendChild(newProjectBtn)
    clickProjectButton()
 };

 function clickProjectButton() {
    const newProjectBtn = document.querySelector('.newProjectBtn');
    newProjectBtn.addEventListener('click', createNewProject)

 }

 



class TodoList {

}

function createTask() {

}

export { createUI, Projects, getProjects, globalProjectArr, globalTaskArr };