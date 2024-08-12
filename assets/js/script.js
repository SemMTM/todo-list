// Global Variables
const input = document.getElementById('inputBox');
let currentTasks = document.getElementById('incomplete-tasks');
let title = document.getElementById('main-title');

/**
 * Add listener for a click of enter button so tasks can be 
 * submitted with Enter press.
 */
document.addEventListener("DOMContentLoaded", function() {
    let buttons = document.getElementsByTagName('button');

    tasksLeft();
    tasksCompleted();
    saveTitle();

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addTask();
            saveTitle();
        }
    });
});

/**
 * Adds a new task to the task list
 * Clears add a task for field.
 */
function addTask() {
    
    let deleteTask = document.createElement('span');
    let newTask = document.getElementById('inputBox').value;
    let newListItem = document.createElement("li");
    let list = document.getElementsByTagName('ul');

    if (newTask == '') {
        alert('Please enter a new task!');
    } else {
    newListItem.textContent = newTask;
    list[0].appendChild(newListItem);
    newListItem.setAttribute("onclick", "completeTask(event)");
    newListItem.appendChild(deleteTask);
    }

    document.getElementById("inputBox").value = "";
    saveTasks();
    tasksLeft();
    saveTitle();
    tasksCompleted();
}

/**
 * Toggles 'complete' class so clicked on tasks are marked as completed.
 * Deletes tasks when x is clicked.
 */
function completeTask(event) {

    let completedTask = event.target;
    let listParent = document.getElementsByTagName('ul');
    
    // If a task is deleted
    if (completedTask.tagName !== "LI") {
        completedTask.parentNode.remove();
        saveTasks();
        saveTitle();
        tasksLeft();
        tasksCompleted();

    // If a task is marked as completed    
    } else if (completedTask.classList == '') {
        completedTask.classList.toggle('completed');
        audioPlay();
        listParent[1].appendChild(completedTask);
        saveTasks();
        saveTitle();
        tasksLeft();
        tasksCompleted();

    // If a task is unmarked as completed    
    } else if (completedTask.classList == 'completed') {
        completedTask.classList.remove('completed');
        listParent[0].appendChild(completedTask);
        saveTasks();
        saveTitle();
        tasksLeft();
        tasksCompleted();
    }
}

/**
 * Calcualtes the number of tasks left and updates the counter
 */
function tasksLeft() {
    let tasksLeft = currentTasks.getElementsByTagName("li");
    let tasksLeftLength = tasksLeft.length;
    let tasksLeftCounter = document.getElementById("tasks-left");

    tasksLeftCounter.textContent = tasksLeftLength;
}

/**
 * Calcualtes the number of tasks completed and updates the counter
 */
function tasksCompleted() {
    let completedTasks = document.getElementById("completed-tasks-list").getElementsByTagName("li");
    let completedTasksLength = completedTasks.length;
    let completedTasksCounter = document.getElementById("tasks-completed");

    completedTasksCounter.textContent = completedTasksLength;
}

/**
 * Functions to save task data locally and retrieve it
 */
function saveTasks() {
    localStorage.setItem("taskData", currentTasks.innerHTML);
}

function getTasks() {
    let title = document.getElementsByTagName('h1');

    currentTasks.innerHTML = localStorage.getItem("taskData");
}
getTasks();

/**
 * Save and call custom to-do list title 
 */
function saveTitle () {
    if (title.textContent == ''){
        title.textContent = 'My To-Do List';
    } else {
        localStorage.setItem("titleData", title.textContent);
    }
}
saveTitle();

function getTitle() {
    title.textContent = localStorage.getItem("titleData");
}
getTitle();

/**
 * Ding Audio that plays on task complete
 */
function audioPlay(){
    const audio = new Audio("./assets/audio/ding-sound-effect.mp3");
    audio.play();
}