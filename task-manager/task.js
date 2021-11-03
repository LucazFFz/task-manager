const States = Object.freeze({
    UNFINISHED: 0,
    FINISHED: 1,
});

function Task (name) {
    this.name = name;
    this.state = States.UNFINISHED;
}

let taskHandler = {
    taskList: [],
    init: function () {
        this.cacheDom();
        this.bindEvents();
    },
    cacheDom: function () {
        this.getInputTask = document.querySelector("#input-task");
        this.getAddBtn = document.querySelector("#add-task-button");
        this.getTaskList = document.querySelector("#tasks");
    },
    bindEvents: function () {
        this.getAddBtn.onclick = this.addTask.bind(this);
    },
    addTask: function () {
        let name = this.getInputTask.value;
        this.taskList.push(new Task(name));
        this.getInputTask.value = "";
        renderNewTask();
        this.evaluateTaskList(); 

        function renderNewTask () {
            let newTaskLi, newTaskCheckbox, newTaskName, newTaskDeleteBtn;
            // BUILD HTML
            newTaskLi = document.createElement("li");
            newTaskLi.setAttribute("class", "task");
            // CHECKBOX
            newTaskCheckbox = document.createElement("input");
            newTaskCheckbox.setAttribute("type", "checkbox");
            // DELETE BUTTON
            newTaskDeleteBtn = document.createElement("button");
            // USER TASK
            newTaskName = document.createTextNode(name);
            // APPEND ELEMENTS TO TASKLI
            newTaskLi.appendChild(newTaskCheckbox);
            newTaskLi.appendChild(newTaskName);
            newTaskLi.appendChild(newTaskDeleteBtn);
            //ADD TASK TI TASK LIST
            taskHandler.getTaskList.appendChild(newTaskLi);
        }
    },
    removeTask: function (i) {
        this.getTaskList.children[i].remove();
        this.evaluateTaskList();
    },
    changeChecked: function (task) {

    },
    evaluateTaskList: function () {
        let checkbox, deleteBtn;
        // BIND CLICK EVENTS TO ELEMENTS
        for (let i = 0; i < this.getTaskList.children.length; i++) {
            // ADD CLICK EVENT TO CHECKBOXES
            checkbox = this.getTaskList.children[i].getElementsByTagName("input")[0];
            checkbox.onclick = this.changeChecked.bind(this);
            // ADD CLICK EVENT TO DELETE BUTTON
            deleteBtn = this.getTaskList.children[i].getElementsByTagName("button")[0];
            deleteBtn.onclick = this.removeTask.bind(this, i);
        }
    },
    renderAllTasks: function () {

    }
    
}





