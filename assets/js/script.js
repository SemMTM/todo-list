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
    priorityTasksRemaining();
    saveTitle();
    dueDateChecker();

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
    let createDiv = document.createElement('div');

    if (newTask == '') {
        alert('Please enter a new task!');
    } else {
        //Appends new task to 'incomplete' tasl list
        newListItem.textContent = newTask;
        list[0].appendChild(newListItem);
        newListItem.setAttribute("onclick", "completeTask(event)");
        newListItem.classList.add('incomplete');
        
        //Add Delete Button
        newListItem.appendChild(deleteTask);
        deleteTask.classList.add('deletebtn');
        
        // Adds Priority Button
        newListItem.appendChild(priorityBtn);
        priorityBtn.classList.add('prioritybtn');
        priorityBtn.setAttribute("onclick", "priorityTask(event)");

        // Adds empty due date divs
        newListItem.insertAdjacentElement('beforeend', createDiv);
        createDiv.classList.add('due-date-container');
        createDiv.innerHTML = `<div class="due-date, hidden"></div>
        <div class="informat-due-date"></div>
        <div class="task-due-in"></div>`;
    }

    document.getElementById("inputBox").value = "";
    saveTasks();
    tasksLeft();
    saveTitle();
    tasksCompleted();
    priorityTasksRemaining();
    dueDateChecker();
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

    // If a task is marked as completed    
    } else if (lastClicked.classList.contains('incomplete')) {
        lastClicked.classList.toggle('completed');
        lastClicked.classList.toggle('incomplete');
        lastClicked.classList.remove('priority-task');
        audioPlay();
        listParent[1].appendChild(lastClicked);

    // If a task is unmarked as completed    
    } else if (lastClicked.classList.contains('completed')) {
        lastClicked.classList.toggle('completed');
        lastClicked.classList.toggle('incomplete');
        listParent[0].appendChild(lastClicked);
    }
    saveTasks();
    saveTitle();
    tasksLeft();
    tasksCompleted();
    priorityTasksRemaining();
    dueDateChecker();
}

/**
 * Set and remove tasks as priority
 */
function priorityTask(event) {
    let lastClicked = event.target;
    let task = lastClicked.parentNode;
    let taskList = document.getElementById('incomplete-tasks');
    let datePopUp = document.getElementById('date-outer');

    //Remove incomplete tasks from priority list and add it back to bottom of incomplete list
    if (task.classList.contains('priority-task') && task.classList.contains('incomplete')) {
        task.classList.toggle('priority-task');
        taskList.appendChild(task);

    //Add incomplete tasks to priority list and move to the top     
    } else if (task.classList.contains !=='priority-task' && task.classList.contains('incomplete')){
        datePopUp.classList.toggle('active');
        datePopUp.classList.toggle('hidden');
        task.classList.toggle('priority-task');
        taskList.insertBefore(task, taskList.firstChild);
    }
    priorityTasksRemaining();
    saveTasks();
    dueDateChecker();
}

/**
 * Close date pop up
 */
function closeDatePopUp() {
    let datePopUp = document.getElementById('date-outer');

    datePopUp.classList.toggle('hidden');
    priorityTasksRemaining();
}

/**
 * Set tasks due date 
 */
function taskDueDate() {
    let selectedDate = document.getElementById('task-date').value;
    let datePopUp = document.getElementById('date-outer');
    let selectedTask = document.getElementById('incomplete-tasks').firstChild;
    const oneDay = 24 * 60 * 60 * 1000; // hours*mins*secs*millisecs
    let currentDate = new Date();
    let dateInFormat = new Date(selectedDate);
    const diffDays = Math.round(Math.abs((currentDate - dateInFormat) / oneDay));
    let userDateString = dateInFormat.toString();
    let trimmedUserDate = userDateString.substring(0, 10);

    if (selectedDate == '') {
        alert ('Please select a date');
    } else {
        // Creates due date on task
        datePopUp.classList.toggle('hidden');
        selectedTask.lastChild.firstChild.textContent = selectedDate;
        selectedTask.lastChild.children[1].innerHTML = `${trimmedUserDate}`;
    }
    priorityTasksRemaining();
    saveTasks();
    dueDateChecker();
}

/**
 * Checks how many days are left until due date and live updates reminder
 */
function dueDateChecker() {
    const incompleteTasks = currentTasks.getElementsByTagName("li");
    let remainingTasksLength = incompleteTasks.length;
    let dueDate = document.getElementsByClassName('due-date').value;
    let currentDate = new Date();

    //Loop to iterate through incomplete tasks
    for (let i = 0; i < remainingTasksLength; i++) {
        let userSetDate = incompleteTasks[i].lastChild.firstChild.textContent;
        let userDateInFormat = new Date(userSetDate);
        const oneDay = 24 * 60 * 60 * 1000; // hours*mins*secs*millisecs
        const diffDays = Math.round(Math.abs((currentDate - userDateInFormat) / oneDay));

        //If User date is less then current date
        if (userDateInFormat < currentDate) {
            incompleteTasks[i].lastChild.lastChild.innerHTML = " - <span style='color:red'> Overdue</span>";

        //If there is no set date    
        } else if (incompleteTasks[i].lastChild.firstChild.textContent == '') {
            //No action

        // If user date is more then todays date    
        } else {
            if (diffDays > 5) {
                incompleteTasks[i].lastChild.lastChild.innerHTML = ` - Due in ${diffDays} Days`;
            } else if (diffDays <= 1) {
                incompleteTasks[i].lastChild.lastChild.innerHTML = " - <span style='color:red'> Due soon</span>";
                currentTasks.insertBefore(incompleteTasks[i], currentTasks.firstChild);
            } else {
                incompleteTasks[i].lastChild.lastChild.innerHTML = ` - <span style='color:orange'> Due in ${diffDays} Days</span>`;
            }
        }
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

/**s
 * Calculates the number of priority tasks
 */
function priorityTasksRemaining() {
    let priorityTasks = document.getElementsByClassName('priority-task').length;
    let priorityTaskCounter = document.getElementById('priority-tasks-left');

    priorityTaskCounter.textContent = priorityTasks;
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