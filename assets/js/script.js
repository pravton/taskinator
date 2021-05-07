var pageContentEl = document.querySelector("#page-content");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompleted = document.querySelector("#tasks-completed");

var tasks = [];

var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //chec if inout values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form");
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");
        
    //send it as an argument to createTaskEl
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribue, we create the object as normal and pass to createTaskEl function
    else {
    //package up data as an object
        var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
        };

        createTaskEl(taskDataObj);
    }

    
};

var createTaskEl = function(taskDataObj) {
     //create list item
     var listItemEl = document.createElement("li");
     //give it a class name
     listItemEl.className = "task-item";

     //add task id as a custom attribute
     listItemEl.setAttribute("data-task-id", taskIdCounter);
 
     //create a div to hold the task info and add to list item
     var taskInfoEl = document.createElement("div");
     //give it a class name
     taskInfoEl.className = "task-info";
     // add HTML content to div
     taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";
     listItemEl.appendChild(taskInfoEl);

     var taskActionsEl = createTaskActions(taskIdCounter);
     listItemEl.appendChild(taskActionsEl);

     //check with if statements and append them accordingly
    if (taskDataObj.status === "to do") {
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
        tasksToDoEl.appendChild(listItemEl);
    }
    else if (taskDataObj.status === "in progress") {
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
        tasksInProgressEl.appendChild(listItemEl);
    }
    else if (taskDataObj.status === "completed") {
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
        tasksCompleted.appendChild(listItemEl);
    }

    //add the id varibale to tasksDataObj
    taskDataObj.id = taskIdCounter;

    //push new data object in to the tasks array
    tasks.push(taskDataObj);

    saveTasks();

     //increase task counter for next unique id
     taskIdCounter++;

};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {

    //edit button was clicked
    if (event.target.matches(".edit-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }
    //delete button was clicked
    else if (event.target.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }

    saveTasks();
};

//function to track the change event
var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue == "completed") {
        tasksCompleted.appendChild(taskSelected);
    }
    //update tasks in the array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();

};

//function to delete the tasks
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //create a new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //if a tasks[i] doesn't match the value of taskID, let's keep that task
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //re-assign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
};

var editTask = function(taskId) {

    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    saveTasks();

    alert("Task Updated");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

//load function v2
var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");
  
    if (!savedTasks) {
      return false;
    }
  
    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into the `createTaskEl()` function
        createTaskEl(savedTasks[i]);
    }
};

loadTasks();

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);







