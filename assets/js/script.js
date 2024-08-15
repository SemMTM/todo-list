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
    let priorityBtn = document.createElement('span');
    let newTask = document.getElementById('inputBox').value;
    let newListItem = document.createElement("li");
    let list = document.getElementsByTagName('ul');

    if (newTask == '') {
        alert('Please enter a new task!');
    } else {
    newListItem.textContent = newTask;
    list[0].appendChild(newListItem);
    newListItem.setAttribute("onclick", "completeTask(event)");
    newListItem.classList.add('incomplete');
    newListItem.appendChild(deleteTask);
    deleteTask.classList.add('deletebtn');
    newListItem.appendChild(priorityBtn);
    priorityBtn.classList.add('prioritybtn');
    priorityBtn.setAttribute("onclick", "priorityTask(event)");
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

    let lastClicked = event.target;
    let listParent = document.getElementsByTagName('ul');
    
    // If a task is deleted
    if (lastClicked.classList.contains("deletebtn")) {
        lastClicked.parentNode.remove();
        saveTasks();
        saveTitle();
        tasksLeft();
        tasksCompleted();

    // If a task is marked as completed    
    } else if (lastClicked.classList.contains('incomplete')) {
        lastClicked.classList.toggle('completed');
        lastClicked.classList.toggle('incomplete');
        lastClicked.classList.remove('priority-task');
        audioPlay();
        listParent[1].appendChild(lastClicked);
        saveTasks();
        saveTitle();
        tasksLeft();
        tasksCompleted();

    // If a task is unmarked as completed    
    } else if (lastClicked.classList.contains('completed')) {
        lastClicked.classList.toggle('completed');
        lastClicked.classList.toggle('incomplete');
        listParent[0].appendChild(lastClicked);
        saveTasks();
        saveTitle();
        tasksLeft();
        tasksCompleted();
    }
}

function priorityTask(event) {
    let lastClicked = event.target;
    let task = lastClicked.parentNode;
    let taskList = document.getElementById('incomplete-tasks');

    //Remove incomplete tasks from priority list and add it back to bottom of incomplete list
    if (task.classList.contains('priority-task') && task.classList.contains('incomplete')) {
        task.classList.toggle('priority-task');
        taskList.appendChild(task);

    //Add incomplete tasks to priority list and move to the top     
    } else if (task.classList.contains !=='priority-task' && task.classList.contains('incomplete')){
        task.classList.toggle('priority-task');
        taskList.insertBefore(task, taskList.firstChild);
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
    const audio = new Audio("./assets/audio/ding.mp3");
    audio.play();
}