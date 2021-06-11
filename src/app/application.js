import firebase from "firebase/app";

//Global Arrays
let globalProjectArr = [];
let globalTaskArr = [];
let globalProjectIdSelection = 1;

function loader(ms) {
    //create a loader when needed. 
}

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
    constructor(name, projectID, tasks, numberOfTasks, taskIDCounter) {
        this.name = name;
        this.projectID = projectID;
        this.tasks = tasks;
        this.numberOfTasks = numberOfTasks;
        this.taskIDCounter = taskIDCounter
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
        //Get name && ID
        const nameValue = document.querySelector('.newProjectName').value;
        var newId = '';
        //Then, remove popUp
        const sideBar = document.querySelector('aside');
        sideBar.removeChild(document.querySelector('.newProjectPopUp'))
        db.collection('userData').doc(user.uid).get().then(doc => {
            newId = doc.data().projectsNum + 1;
            const newProject = new Projects(nameValue, newId, [], 0)
            db.collection('userData').doc(user.uid).update({
                projectsArr: firebase.firestore.FieldValue.arrayUnion(JSON.stringify(newProject)),
                projectsNum: firebase.firestore.FieldValue.increment(1),
            })
            db.collection('userData').doc(user.uid).get().then((doc) => { 
                console.log(doc.data());
                getProjects()
                })
        })
        
       
        //Put JSON object into database
    }
}
function getProjects(){
    //Get projects from DB and push to globalProjectArr
    globalProjectArr = [];
    const db = firebase.firestore();
    const user = firebase.auth().currentUser;
    //Create load icon
    setTimeout(() => {
    db.collection('userData').doc(user.uid).get().then((doc) => {
        for(let i = 0; i < doc.data().projectsArr.length; i++) {
            globalProjectArr.push(JSON.parse(doc.data().projectsArr[i]));
            // console.log(globalProjectArr);
        }
        getTasks();
        createProjectsFromLoad();
    })
    },1000)
}

function createProjectsFromLoad() {
    const sideBar = document.querySelector('aside');
        if(document.querySelector('.projects')) {
            const projects = document.querySelectorAll('.projects')
            for(let i = 0; i < projects.length; i++) {
                sideBar.removeChild(projects[i]);
            }
        }
    for(let i = 0; i < globalProjectArr.length; i++) {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('projects');
        projectDiv.setAttribute('id', `project${globalProjectArr[i].projectID}`)
        projectDiv.innerHTML = `<h3>Name: ${globalProjectArr[i].name}</h3><h4>Tasks: ${globalProjectArr[i].tasks.length}</h4><i id="delete${globalProjectArr[i].projectID}" class="fas fa-times"></i></i>`
        sideBar.appendChild(projectDiv);
    }
    newProjectButton();
    sideBar.addEventListener('click', deleteProject)

    //Start New Task loadlink
    newTaskButton();
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

 function deleteProject(e) {
    //Get Firestore
    const db = firebase.firestore();
    const user = firebase.auth().currentUser;
    //Get available IDs
    const availableIDs = globalProjectArr.map((item) => item.projectID)
        for(let i = 0; i < availableIDs.length; i++) {
            if(e.target.id == `delete${availableIDs[i]}`) {
                // console.log(availableIDs[i])
                const index = availableIDs.indexOf(availableIDs[i])
                db.collection('userData').doc(user.uid).update({
                    projectsArr: firebase.firestore.FieldValue.arrayRemove(JSON.stringify(globalProjectArr[index]))
                })
                db.collection('userData').doc(user.uid).get().then((doc) => { 
                    console.log(doc.data());
                    getProjects()
                    })
                
             
            }
        }
    
 }

//Tasks below
class Tasks {
    constructor(name, description, dueDate, taskID) {
        this.name = name,
        this.description = description,
        this.dueDate = dueDate,
        this.taskID = taskID
    }
}

function newTaskButton() {
    console.log('new Task Button')
    const section = document.querySelector('section');
    if(document.querySelector('.newTaskBtn')) {
        section.removeChild(document.querySelector('.newTaskBtn'))
    }
    const createTaskBtn = document.createElement('div');
    createTaskBtn.classList.add('newTaskBtn');
    createTaskBtn.innerHTML = '<i class="fas fa-plus-circle"></i><h3>Create New Task</h3>'
    section.appendChild(createTaskBtn)
    clickTaskButton()
}

function clickTaskButton() {
    const createTaskBtn = document.querySelector('.newTaskBtn');
    createTaskBtn.addEventListener('click', createNewTask)
 }




function createNewTask() {
    //Pop-up Task Name
    (function createNewTaskPopUp() {
        const section = document.querySelector('section');
        if(document.querySelector('.newTaskPopUp')) {
            section.removeChild(document.querySelector('.newTaskPopUp'))
        }
        const newTaskPopUp = document.createElement('div');
        newTaskPopUp.classList.add('newTaskPopUp');
        newTaskPopUp.innerHTML = `<h3>Name: </h3><input class="newTaskName" type="text" placeholder="Task Name"></input>
        <h3>Date: </h3><input class="newTaskDate" type="date">
        <i id="saveTaskBtn" class="fas fa-save"></i>`
        section.insertBefore(newTaskPopUp, document.querySelector('.newTaskBtn'));
        //Add event listener to Save Project button
        const saveTaskBtn = document.querySelector('#saveTaskBtn');
        saveTaskBtn.addEventListener('click', createTaskObject);
    })();

    function createTaskObject() {
        //Get Firestore
        const db = firebase.firestore();
        const user = firebase.auth().currentUser;
        //Get Values
        const taskName = document.querySelector('.newTaskName').value;
        const taskDate = document.querySelector('.newTaskDate').value;
        //Then, remove popUp
        const section = document.querySelector('section');
        section.removeChild(document.querySelector('.newTaskPopUp'))
        //New plan: get globalProjectArr, update it with what's needed and replace the full array with that One.
        //Remova all from db for update
        for(let i = 0; i < globalProjectArr.length; i++) {
            db.collection('userData').doc(user.uid).update({
                projectsArr: firebase.firestore.FieldValue.arrayRemove(JSON.stringify(globalProjectArr[i]))
            })
        }
        for(let i = 0; i < globalProjectArr.length; i++) {
            if(globalProjectArr[i].projectID === globalProjectIdSelection) {
                var indexOfArr = i;
                var arr = globalProjectArr[i];
                arr.numberOfTasks += 1;
            }
        }
        const task = new Tasks(taskName, '', taskDate, arr.numberOfTasks);
        // task.daysLeft = task.convertToDaysLeft(); //Gör denna bara visuellt ist och spara endast datum i databasen för att slippa uppdatera
        arr.tasks.push(task);
        globalProjectArr.splice(indexOfArr, 1, arr); //Take index replace with new arr
        //Set db array with GlobalProjectArr! 
        for(let i = 0; i < globalProjectArr.length; i++) {
            db.collection('userData').doc(user.uid).update({
                projectsArr: firebase.firestore.FieldValue.arrayUnion(JSON.stringify(globalProjectArr[i]))
            })
        }
        // Plus one on tasks project sidebar
        getProjects()
        getTasks()
    }
    
}

function getTasks() {
    //Get current Project
    for(let i = 0; i < globalProjectArr.length; i++) {
        if(globalProjectArr[i].projectID === globalProjectIdSelection) {
            var indexOfArr = i;
            var arr = globalProjectArr[i];
        }
    }
    globalTaskArr = [];
    if(arr) {
        for(let i = 0; i < arr.tasks.length; i++) {
            globalTaskArr.push(arr.tasks[i]);
        }
    }
    
    createTasksFromLoad();
}

function createTasksFromLoad() {
    const section = document.querySelector('section');
    if(document.querySelector('.tasks')) {
        const tasks = document.querySelectorAll('.tasks');
        for(let i = 0; i < tasks.length; i++) {
            section.removeChild(tasks[i]);
        }
     }
    for(let i = 0; i < globalTaskArr.length; i++) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('tasks');
        taskDiv.setAttribute('id', `task${globalTaskArr[i].taskID}`);
        taskDiv.innerHTML = `<h3>Name: ${globalTaskArr[i].name}</h3><h3>Days left: ${convertToDaysLeft(globalTaskArr[i].dueDate)}</h3>`
        section.appendChild(taskDiv);
    }
    newTaskButton()
    console.log(globalTaskArr);
}

function convertToDaysLeft(dueDate) {
    const currentDate = Date.now();
    const dueDateMs = new Date(dueDate).getTime();
    const daysLeft = Math.ceil(((dueDateMs - currentDate) / 86400000)) ;
    return daysLeft;
}

export { createUI, Projects, getProjects, globalProjectArr, globalTaskArr };