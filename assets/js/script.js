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
    deleteTask.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>'
    newListItem.appendChild(deleteTask);
    }

    document.getElementById("inputBox").value = "";
}

/**
 * Toggles 'complete' class so clicked on tasks
 * are marked as completed.
 */
function completeTask(event) {
    let completedTask = event.target;

    completedTask.classList.toggle('completed');
}