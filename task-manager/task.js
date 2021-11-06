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
        // ADD EVENTS
        this.getAddBtn.addEventListener("click", 
        this.handleInput.bind(this, this.addTask));
        window.addEventListener("keypress", event => {
            if(event.code === "Enter") this.handleInput(this.addTask);
        });
        // DELETE EVENTS
        this.getTasks.addEventListener("click", event => {
            if(event.target.classList.contains("delete-task")) {
                const itemKey = event.target.parentElement.dataset.key;
                this.deleteTask(itemKey);
            }
        });
        // COMPLETED EVENTS
        this.getTasks.addEventListener("click", event => {
            if(event.target.classList.contains("completed-task")) {
                const itemKey = event.target.parentElement.dataset.key;
                this.taskCompletedToggle(itemKey);
            }
        });
    },
    handleInput: function(func) {
        resetError(); 
        let text = this.getInputTask.value;
        let result = validateInputText(text);
        if(result.valid == true) {
            func(text);
            this.getInputTask.value = "";
        } else error(result.msg);

        function validateInputText(text) {
            // CONTROL TASK TEXT
            // RETURNS AN OBJECT
            if(text == "") return {valid: false, msg: "Enter a task"};
            if(taskList.some(obj => obj.text == text)) 
            return {valid: false, msg: "Task already exists"};
            return {valid: true};
        }
        function error(msg) {
            taskHandler.getInputTask.setAttribute("class", "error");
            taskHandler.getErrorMsg.innerHTML = msg;
        }
        function resetError() {
            taskHandler.getInputTask.removeAttribute("class", "error");
            taskHandler.getErrorMsg.innerHTML = "";
        }
    },
    addTask: function(text) {
        const task = {
            text,
            isChecked: false,
            id: Date.now(),
        };
        taskList.push(task);
        taskHandler.renderTask(task);
    },
    deleteTask: function(key) {
        const index = taskList.findIndex(item => item.id === Number(key));
        const task = {
            deleted: true,
            ...taskList[index]
        }
        taskList.splice(index, 1);
        this.renderTask(task);
    },
    taskCompletedToggle: function (key) {
        const index = taskList.findIndex(item => item.id === Number(key));
        taskList[index].checked = !taskList[index].checked;
        this.renderTask(taskList[index]);
    },
    renderTask: function(task) {
        let newTaskLi, newTaskCheckbox, newTaskName, newTaskDeleteBtn;
        // GET TASK HTML ELEMENT
        const item = document.querySelector(`[data-key="${task.id}"]`);
        // CHECK IF DELETED
        if(task.deleted) {
            item.remove();
            return;
        }
        // BUILD HTML
        newTaskLi = document.createElement("li");
        let isCompleted = task.checked ? "completed" : "";
        newTaskLi.setAttribute("class", `task ${isCompleted}`);
        newTaskLi.setAttribute("data-key", task.id);
        // CHECKBOX
        newTaskCheckbox = document.createElement("input");
        newTaskCheckbox.setAttribute("type", "checkbox");
        newTaskCheckbox.setAttribute("class", "completed-task");
        // DELETE BUTTON
        newTaskDeleteBtn = document.createElement("button");
        newTaskDeleteBtn.setAttribute("class", "delete-task");
        // USER TASK
        newTaskName = document.createTextNode(task.text);
        // APPEND ELEMENTS TO TASK LI
        newTaskLi.appendChild(newTaskCheckbox);
        newTaskLi.appendChild(newTaskName);
        newTaskLi.appendChild(newTaskDeleteBtn);
        //ADD TASK TO TASK LIST
        if(item) {
            this.getTasks.replaceChild(newTaskLi, item);
        } else this.getTasks.appendChild(newTaskLi);
    }
}