let taskList = [];
let taskHandler = {
    init: function () {
        this.cacheDom();
        this.setEvents();
    },
    cacheDom: function() {
        // CACHE HTML ELEMENTS
        this.getInputTask = document.querySelector("#input-task");
        this.getAddBtn = document.querySelector("#add-task-btn");
        this.getErrorMsg = document.querySelector(".errorMessage");
        this.getTasks = document.querySelector("#tasks");
        this.getTasksChildren = this.getTasks.children;
        this.getClearCompletedBtn = document.querySelector("#clear-completed-btn");
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
        // !CLEAR COMPLETED EVENTS
        this.getClearCompletedBtn.addEventListener("click", event => {
            for (let index = 0; index < taskList.length; index++) {
                if(taskList[index].isChecked) console.log("hej");
            }
        });
    },
    handleInput: function(callFunc) {
        resetError(); 
        let text = this.getInputTask.value;
        let result = validateInputText(text);
        if(result.valid == true) {
            callFunc(text);
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
        taskList[index].isChecked = !taskList[index].isChecked;
        this.renderTask(taskList[index]);
    },
    tasksLeftCounter: function () {
        const taskCounter = taskList.filter(task => !task.isChecked).length;
        const counter = document.querySelector("#tasks-left");
        const counterString = taskCounter === 1 ? "item" : "items";
        counter.innerText = `${taskCounter} ${counterString} left`;
    },
    renderTask: function(task) {
        // GET HTML ELEMENT OF TASK
        const item = document.querySelector(`[data-key="${task.id}"]`);
        // CHECKS
        if(task.deleted) item.remove();
        else if(item) {
            this.getTasks.replaceChild(buildHTML(), item);
        } else this.getTasks.appendChild(buildHTML());
        this.tasksLeftCounter();

        function buildHTML() {
            let newTaskLi, newTaskCheckbox, newTaskName, newTaskDeleteBtn, newTaskText;
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
            newTaskDeleteBtn.innerText = "Delete";
            // USER TASK
            newTaskText = document.createElement("p");
            newTaskText.setAttribute("class", "text");
            newTaskName = document.createTextNode(task.text);
            newTaskText.appendChild(newTaskName);
            // APPEND ELEMENTS TO TASK LI
            newTaskLi.appendChild(newTaskCheckbox);
            newTaskLi.appendChild(newTaskText);
            newTaskLi.appendChild(newTaskDeleteBtn);
            return newTaskLi;
        }
    }
}