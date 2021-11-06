let taskList = [];
let taskHandler = {
    init: function () {
        this.cacheDom();
        this.setEvents();
    },
    cacheDom: function() {
        // CACHE HTML ELEMENTS
        this.getInputTask = document.querySelector("#input-task");
        this.getAddBtn = document.querySelector("#add-task-button");
        this.getErrorMsg = document.querySelector(".errorMessage");
        this.getTasks = document.querySelector("#tasks");
        this.getTasksChildren = this.getTasks.children;
    },
    setEvents: function() {
        this.getAddBtn.addEventListener("click", hej.bind(this));
        window.addEventListener("keypress", event => event.code == "Enter" ? hej() : false);       

        function hej() {
            taskHandler.resetError(); 
            let text = taskHandler.getInputTask.value;
            let result = taskHandler.validateTasktext(text);
            if(result.valid == true) {
                taskHandler.addTask(text);
                taskHandler.getInputTask.value = "";
            } else taskHandler.error(result.msg);
        }
    },
    validateTasktext: function (text) {
        // CONTROL TASK TEXT
        // RETURNS AN OBJECT
        if(text == "") return {valid: false, msg: "Enter a task"};
        if(taskList.some(obj => obj.text == text)) 
        return {valid: false, msg: "Task already exists"};
        return {valid: true};
    },
    error: function(msg) {
        this.getInputTask.setAttribute("class", "error");
        this.getErrorMsg.innerHTML = msg;
    },
    resetError: function() {
        this.getInputTask.removeAttribute("class", "error");
        this.getErrorMsg.innerHTML = "";

    },
    addTask: function(text) {
        const task = {
            text,
            checked: false,
            id: Date.now(),
        };
        taskList.push(task);
        this.renderTask(task);
        this.evaluateTaskList(); 
        console.log(taskList);
    },
    renderTask: function(task) {
        let newTaskLi, newTaskCheckbox, newTaskName, newTaskDeleteBtn;
        // BUILD HTML
        newTaskLi = document.createElement("li");
        newTaskLi.setAttribute("class", "task");

        if(task.delelted) {
            
        }
        // CHECKBOX
        newTaskCheckbox = document.createElement("input");
        newTaskCheckbox.setAttribute("type", "checkbox");
        // DELETE BUTTON
        newTaskDeleteBtn = document.createElement("button");
        // USER TASK
        newTaskName = document.createTextNode(task.text);
        // APPEND ELEMENTS TO TASKLI
        newTaskLi.appendChild(newTaskCheckbox);
        newTaskLi.appendChild(newTaskName);
        newTaskLi.appendChild(newTaskDeleteBtn);
        //ADD TASK TO TASK LIST
        taskHandler.getTasks.appendChild(newTaskLi);
    },
    deleteTask: function(key) {
        const index = taskList.findIndex(item => item.id === Number(key));
        const task = {
            delelted: true,
            ...taskList[index]
        }
        taskList.splice(index, 1);
        this.renderTask(task);
        console.log(taskList);
    },
    changeChecked: function (task) {
        
    },
    evaluateTaskList: function() {
        let checkbox, deleteBtn;
        // BIND CLICK EVENTS TO ELEMENTS
        for (let i = 0; i < this.getTasksChildren.length ; i++) {
            // ADD CLICK EVENT TO CHECKBOXES
            checkbox = this.getTasksChildren[i].getElementsByTagName("input")[0];
            checkbox.onclick = this.changeChecked.bind(this, );
            // ADD CLICK EVENT TO DELETE BUTTON
            deleteBtn = this.getTasksChildren[i].getElementsByTagName("button")[0];
            deleteBtn.onclick = this.deleteTask.bind(this, i);
        }
    }
}





