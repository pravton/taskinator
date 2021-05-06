var formEl = document.querySelector("#task-form");
var taskToDoEl = document.querySelector("#task-to-do");

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    //package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    //chec if inout values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form");
        return false;
    }

    formEl.reset();
        
    //send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
};

var createTaskEl = function(taskDataObj) {
     //create list item
     var listItemEl = document.createElement("li");
     //give it a class name
     listItemEl.className = "task-item";
 
     //create a div to hold the task info and add to list item
     var taskInfoEl = document.createElement("div");
     //give it a class name
     taskInfoEl.className = "task-info";
     // add HTML content to div
     taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";
     listItemEl.appendChild(taskInfoEl);
 
     //add entire list item to list
     taskToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit", taskFormHandler);

