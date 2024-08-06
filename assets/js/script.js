const input = document.getElementById('inputBox');

/**
 * Adds a new task to the task list
 * Clears add a task for field.
 */
function addTask() {
    let newTask = document.getElementById('inputBox').value;
    let newListItem = document.createElement("li");
    let list = document.getElementsByTagName('ul');
    
    if (newTask == '') {
        alert('Please enter a new task!');
    } else {
    newListItem.textContent = newTask;
    list[0].appendChild(newListItem);
    newListItem.setAttribute("onclick", "completeTask(event)");
    }

    document.getElementById("inputBox").value = "";
}

function completeTask(event) {
    let completedTask = event.target;

    completedTask.classList.toggle('completed');
}