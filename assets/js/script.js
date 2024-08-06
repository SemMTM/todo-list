const input = document.getElementById('inputBox');

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
}

/**
 * Toggles 'complete' class so clicked on tasks
 * are marked as completed.
 * Also deletes tasks when x is clicked
 */
function completeTask(event) {
    let completedTask = event.target;
     
    if (completedTask.tagName !== "LI") {
        completedTask.parentNode.remove();
    } else {
        completedTask.classList.toggle('completed');
    }
     
}