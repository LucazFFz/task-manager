let taskList = [];
let taskHandler = {
    init: function () {
        // --- CACHE HTML ELEMENTS ---
        this.getInputTask = document.querySelector("#tasker-input");
        this.getInputText = document.querySelector("#input-text");
        this.getAddBtn = document.querySelector("#add-task-btn");
        this.getTasks = document.querySelector("#tasks");
        this.getTasksChildren = this.getTasks.children;
        this.getClearCompletedBtn = document.querySelector("#clear-completed-btn");

        // --- SET EVENTS ---
        // ADD EVENTS
        this.getAddBtn.addEventListener("click", 
        this.handleInput.bind(this));
        window.addEventListener("keypress", event => {
            if(event.code === "Enter") this.handleInput();
        });
        // DELETE EVENTS
        this.getTasks.addEventListener("click", event => {
            if(event.target.classList.contains("delete-task-btn")) {
                const itemKey = event.target.parentElement.dataset.key;
                this.deleteTask(itemKey);
            }
        });
        // COMPLETED EVENTS
        this.getTasks.addEventListener("click", event => {
            if(event.target.classList.contains("complete-task-cb")) {
                const itemKey = event.target.parentElement.dataset.key;
                this.taskCompletedToggle(itemKey);
            }
        });
        // CLEAR COMPLETED EVENTS
        this.getClearCompletedBtn.addEventListener("click", () => {
            this.deleteCompletedTasks(taskList);
        });
    },
    handleInput: function() {
        let text = taskHandler.getInputText.value;
        // RESET ERROR
        taskHandler.getInputTask.classList.remove("error")
        // CONTROL TEXT
        let result = validateInputText(text);
        if(result == true) {
            taskHandler.getInputText.value = "";
            this.addTask(text);
        } else error();

        function validateInputText(text) {
            // CONTROL TASK TEXT
            // RETURNS AN OBJECT
            if(text == "") return false;
            if(taskList.some(obj => obj.text == text)) return false;
            return true;
        }
        function error() {
            taskHandler.getInputTask.classList.add("error");
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
    taskCompletedToggle: function(key) {
        const index = taskList.findIndex(item => item.id === Number(key));
        taskList[index].isChecked = !taskList[index].isChecked;
        this.renderTask(taskList[index]);
    },
    tasksLeftCounter: function() {
        const taskCounter = taskList.filter(task => !task.isChecked).length;
        const counter = document.querySelector("#tasks-left");
        const counterString = taskCounter === 1 ? "task" : "tasks";
        counter.innerText = `${taskCounter} ${counterString} left`;
    },
    deleteCompletedTasks: function(taskList) {
        let list = [];
        // ADD TO TEMPORARY ARRAY
        taskList.forEach(task => { if(task.isChecked) list.push(task); });
        list.forEach(task => { this.deleteTask(task.id); });
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
            let isCompleted = task.isChecked ? " completed" : "";
            console.log(`task${isCompleted}`);
            newTaskLi.setAttribute("class", `task${isCompleted}`);
            newTaskLi.setAttribute("data-key", task.id);
            // CHECKBOX
            newTaskCheckbox = document.createElement("input");
            newTaskCheckbox.setAttribute("type", "checkbox");
            newTaskCheckbox.setAttribute("class", "cb complete-task-cb");
            if(task.isChecked) {
                let newIconCheck = document.createElement("i");
                newIconCheck.setAttribute("class", 'fas fa-check');
                newTaskCheckbox.appendChild(newIconCheck);
            }
            // TEXT
            newTaskText = document.createElement("p");
            newTaskText.setAttribute("class", "text");
            newTaskName = document.createTextNode(task.text);
            newTaskText.appendChild(newTaskName);
            // DELETE BUTTON
            newTaskDeleteBtn = document.createElement("button");
            newTaskDeleteBtn.setAttribute("class", "btn-icon delete-task-btn");
            let newIconTrash = document.createElement("i");
            newIconTrash.setAttribute("class", 'fas fa-trash');
            newTaskDeleteBtn.appendChild(newIconTrash);
            // APPEND ELEMENTS TO TASK LI
            newTaskLi.appendChild(newTaskCheckbox);
            newTaskLi.appendChild(newTaskText);
            newTaskLi.appendChild(newTaskDeleteBtn);
            return newTaskLi;
        }
    }
}