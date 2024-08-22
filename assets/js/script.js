// Global Variables
const input = document.getElementById('inputBox');
let currentTasks = document.getElementById('incomplete-tasks');
let title = document.getElementById('main-title');
let totalTasksNumber = 1;
let taskIdCounter = document.getElementById('total-tasks');
totalTasksNumber = parseInt(localStorage.getItem("taskIdNumber", totalTasksNumber)) || 0;

/**
 * Add listener for a click of enter button so tasks can be 
 * submitted with Enter press.
 */
document.addEventListener("DOMContentLoaded", function() {

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
        //Appends new task to 'incomplete' task list
        totalTasksCounter();
        newListItem.textContent = newTask;
        list[0].appendChild(newListItem);
        newListItem.setAttribute("onclick", "completeTask(event)");
        newListItem.classList.add('incomplete');

        //Assigns each new task a unique ID
        newListItem.setAttribute("id", `taskid${totalTasksNumber}`);
        saveTaskIds();
        console.log(totalTasksNumber);
        
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
    saveTaskIds();
}

/**
 * Toggles 'complete' class so clicked on tasks are marked as completed.
 * Opens delete task pop up when X is pressed
 */
function completeTask(event) {
    let lastClicked = event.target;
    let listParent = document.getElementsByTagName('ul');
    const taskId = lastClicked.parentElement.id;
    const deletePopUp = document.getElementById('delete-pop-up');
    const deleteBtn = document.getElementById('delete-task-btn');
    
    // If a task is deleted
    if (lastClicked.classList.contains("deletebtn")) {
        lastClicked.dataset.listId = taskId;
        deletePopUp.classList.toggle('hidden');
        const uniqueId = lastClicked.dataset.listId;
        deleteBtn.dataset.listId = uniqueId;

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
    saveTaskIds();
}

function deleteTask(event) {
    let lastClicked = event.currentTarget;
    const deletePopUp = document.getElementById('delete-pop-up');
    const deleteBtn = document.getElementById('delete-task-btn');
    let buttonId = deleteBtn.dataset.listId;
    const listItem = document.getElementById(`${buttonId}`);

    const uniqueId = lastClicked.dataset.listId;
    deleteBtn.dataset.listId = uniqueId;
    listItem.remove();
    deletePopUp.classList.toggle('hidden');

    saveTasks();
    tasksCompleted();
    priorityTasksRemaining();
    tasksLeft();
}

function closeDeletePopUp() {
    const deletePopUp = document.getElementById('delete-pop-up');

    deletePopUp.classList.toggle('hidden');
}

/**
 * Set and remove tasks as priority
 */
function priorityTask(event) {
    let lastClicked = event.currentTarget;
    let task = lastClicked.parentElement;
    const taskId = lastClicked.parentElement.id;
    let datePopUp = document.getElementById('date-outer');
    const setPriorityBtn = document.getElementById('set-priority-btn');

    if (task.classList.contains('completed')) {
        //Do nothing if task is marked as complete
    } else {
        datePopUp.classList.toggle('hidden');
        lastClicked.dataset.listId = taskId;
        const uniqueId = lastClicked.dataset.listId;
        setPriorityBtn.dataset.listId = uniqueId;
    }

    saveTasks();
    dueDateChecker();
    saveTaskIds();
}

function setPriority() {
    const setPriorityBtn = document.getElementById('set-priority-btn');
    let buttonId = setPriorityBtn.dataset.listId;
    const listItem = document.getElementById(`${buttonId}`);
    const taskList = document.getElementById('incomplete-tasks');
    let datePopUp = document.getElementById('date-outer');

    listItem.classList.toggle('priority-task');

    if (listItem.classList.contains('priority-task')) {
        taskList.insertBefore(listItem, taskList.firstChild);
    } else {
        taskList.insertBefore(listItem, taskList.lastChild);
    }
    datePopUp.classList.toggle('hidden');

    priorityTasksRemaining();
    saveTasks();
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
    let dateInFormat = new Date(selectedDate);
    let userDateString = dateInFormat.toString();
    let trimmedUserDate = userDateString.substring(0, 10);
    const setPriorityBtn = document.getElementById('set-priority-btn');
    let buttonId = setPriorityBtn.dataset.listId;
    const listItem = document.getElementById(`${buttonId}`);

    if (selectedDate == '') {
        alert ('Please select a date');
    } else {
        // Creates due date on task
        datePopUp.classList.toggle('hidden');
        listItem.lastChild.firstChild.textContent = selectedDate;
        listItem.lastChild.children[1].innerHTML = `${trimmedUserDate}`;
    }
    priorityTasksRemaining();
    saveTasks();
    saveTaskIds();
    dueDateChecker();
}

/**
 * Checks how many days are left until due date and live updates reminder
 */
function dueDateChecker() {
    const incompleteTasks = currentTasks.getElementsByTagName("li");
    let remainingTasksLength = incompleteTasks.length;
    let currentDate = new Date();

    //Loop to iterate through incomplete tasks
    for (let i = 0; i < remainingTasksLength; i++) {
        let userSetDate = incompleteTasks[i].lastChild.firstChild.textContent;
        let userDateInFormat = new Date(userSetDate);
        const oneDay = 24 * 60 * 60 * 1000; // hours*mins*secs*millisecs
        const diffDays = Math.round(Math.abs((currentDate - userDateInFormat) / oneDay));
        let userDateString = userDateInFormat.toString();
        let trimmedUserDate = userDateString.substring(0, 10);
        let currentDateString = currentDate.toString();
        let trimmedCurrentDate = currentDateString.substring(0, 10);

        //If user dates is today
        if (trimmedUserDate == trimmedCurrentDate) { 
            incompleteTasks[i].lastChild.lastChild.innerHTML = " - <span style='color:#6495FF'> Due Today</span>";  
        
        //If User date is less then current date
        } else if (userDateInFormat < currentDate) {
            incompleteTasks[i].lastChild.lastChild.innerHTML = " - <span style='color:red'> Overdue</span>"; 

        //If there is no set date    
        } else if (incompleteTasks[i].lastChild.firstChild.textContent == '') {
            //No action

        // If user date is more then todays date    
        } else {
            if (diffDays > 5) {
                incompleteTasks[i].lastChild.lastChild.innerHTML = ` - Due in ${diffDays} Days`;
            } else if (diffDays <= 1) {
                incompleteTasks[i].lastChild.lastChild.innerHTML = " - <span style='color:orange'> Due soon</span>";
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

/**
 * Calculates the number of priority tasks
 */
function priorityTasksRemaining() {
    let priorityTasks = document.getElementsByClassName('priority-task').length;
    let priorityTaskCounter = document.getElementById('priority-tasks-left');

    priorityTaskCounter.textContent = priorityTasks;
}

/**
 * Increment counter everytime new task is made and assign tasksIds a unique ID
 */
function totalTasksCounter() {
    totalTasksNumber += 1;

    let tasksId = `taskid${totalTasksNumber}`;

    taskIdCounter.textContent = tasksId;
}

//Functions to save and retrieve tasks unique Ids
function saveTaskIds() {
    localStorage.setItem("taskIdNumber", totalTasksNumber);
    localStorage.setItem("taskIdNumberText", taskIdCounter.textContent);
}

function getTaskIds() {
    localStorage.getItem("taskIdNumber", totalTasksNumber);
    taskIdCounter.textContent = localStorage.getItem("taskIdNumberText", taskIdCounter.textContent);
}
getTaskIds();

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