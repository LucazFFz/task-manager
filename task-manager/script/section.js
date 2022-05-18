function Section(id, title, taskList, isDefaultSection = false) {
    this.id = id;
    this.title = title;
    this.taskList = taskList;
    this.isDefaultSection = isDefaultSection;
}
Section.prototype.setEvents = function() {
     //--- SET EVENTS ---
     // ADD TASK
    
     const section = document.querySelector(`[data-id='${this.id}']`)

    section.addEventListener("click", event => {
        if(event.target.classList.contains("add-task-btn")) {
            const sectionElement = document.querySelector(`[data-id='${this.id}']`);
            const title = sectionElement.querySelector(".add-task-title").value;
            const desc = sectionElement.querySelector(".add-task-desc").value
            this.addTask(title, desc);
        }
    });    
     
}
Section.prototype.handleInput = function() {
    let name = this.getInputText.value;
    console.log(name);
    // RESET ERROR
    this.getInputTask.classList.remove("error")
    // CONTROL TEXT
    let result = validateInputText(name, this.taskList);
    if(result == true) {
        this.getInputText.value = "";
        this.addTask(name);
    } else error(this.getInputTask);

    function validateInputText(name, taskList) {
        // CONTROL TASK TEXT
        // RETURNS AN OBJECT
        if(name == "") return false;
        if(taskList.some(obj => obj.text == name)) return false;
        return true;
    }
    function error(getInputTask) {
        getInputTask.classList.add("error");
    }
}
Section.prototype.addTask = function(title, desc) {
    const id = parseInt(this.id.toString() + (this.taskList.length + 300).toString());
    const task = {
        title: title,
        desc: desc,
        isChecked: false,
        id: id,
        setEvents: function(section) {
            // DELETE TASK
            const taskElement = document.querySelector(`[data-id='${this.id}']`);
            taskElement.addEventListener("click", event => {
                if(event.target.classList.contains("delete-task-btn")) {
                    section.deleteTask(this.id);     
                }
            });
            // COMPLETE TASK
            taskElement.addEventListener("click", event => {
                if(event.target.classList.contains("complete-task-cb")) {
                    section.toggleCompleted(this.id);
                }   
            });
        }
    };
    this.taskList.push(task);
    this.renderTask(task);
    // CREATE AND CALL TASK ADDED EVENT
    const event = new CustomEvent("section:task-added", {
        detail: {
           task: this.taskList[this.taskList.length - 1],
           section: this,
           project: projectHandler.currentProject
        }
    });
    document.dispatchEvent(event);
}
Section.prototype.deleteTask = function(id) {
    const index = this.taskList.findIndex(item => item.id === Number(id));
    const task = {
        deleted: true,  
        ...this.taskList[index]
    }
    this.taskList.splice(index, 1);
    this.renderTask(task);
    
    const event = new CustomEvent("section:task-deleted", {
        detail: {
           task: this.taskList[this.taskList.length - 1],
           section: this,
           project: projectHandler.currentProject
        }
    });
    document.dispatchEvent(event);
}
Section.prototype.toggleCompleted = function(id) {
    const index = this.taskList.findIndex(item => item.id === Number(id));
    this.taskList[index].isChecked = !this.taskList[index].isChecked;
    this.renderTask(this.taskList[index]);

    const event = new CustomEvent("section:task-completed", {
        detail: {
           task: this.taskList[this.taskList.length - 1],
           section: this,
           project: projectHandler.currentProject
        }
    });
    document.dispatchEvent(event);
}
Section.prototype.tasksLeft = function() {
    const taskCounter = this.taskList.filter(task => !task.isChecked).length;
    return taskCounter;
}
Section.prototype.deleteCompletedTasks = function() {
    let list = [];
    // ADD TO TEMPORARY ARRAY
    this.taskList.forEach(task => { if(task.isChecked) list.push(task); });
    list.forEach(task => { this.deleteTask(task.id); });
}
Section.prototype.renderAddTaskBtn = function() {
    // ADD TASK
    let button = document.createElement("button");
    button.setAttribute("class", "add-task-btn btn-text-borderless");
    button.append(document.createTextNode("add task"));
    let inputTitle = document.createElement("input");
    inputTitle.setAttribute("class", "add-task-title");
    let inputDesc = document.createElement("input");
    inputDesc.setAttribute("class", "add-task-desc");

    const sectionElement = document.querySelector(`[data-id='${this.id}']`);
    sectionElement.append(button);
    sectionElement.append(inputTitle);
    sectionElement.append(inputDesc);
}
Section.prototype.renderInput = function() {
    
}
Section.prototype.renderAllTasks = function() {
    this.taskList.forEach(task => {
        this.renderTask(task);
    });
},
Section.prototype.renderTask = function(task) {
    ulElement = document.querySelector(`[data-id='${this.id}']`).querySelector(".tasks");

    // GET HTML ELEMENT OF TASK
    const item = document.querySelector(`[data-id="${task.id}"]`);
    // CHECKS
    if(task.deleted) {
        item.remove();
        return;
    }
    else if(item) {
        ulElement.replaceChild(buildHTML(), item);
    } else {
        ulElement.appendChild(buildHTML());
    }
    task.setEvents(this);
    this.tasksLeft();
    
    function buildHTML() {
        let liElement, checkboxElement, titleElement, descElement, DeleteBtnElement, textContainerElement;
        // BUILD HTML
        liElement = document.createElement("li");
        let isCompleted = task.isChecked ? " completed" : "";
        liElement.setAttribute("class", `task${isCompleted}`);
        liElement.setAttribute("data-id", task.id);
        // CHECKBOX
        checkboxElement = document.createElement("input");
        checkboxElement.setAttribute("type", "checkbox");
        checkboxElement.setAttribute("class", "cb complete-task-cb hover-scale");
        if(task.isChecked) {
            let newIconCheck = document.createElement("i");
            newIconCheck.setAttribute("class", 'fas fa-check');
            checkboxElement.appendChild(newIconCheck);
        }
        // TEXT CONTAINER
        textContainerElement = document.createElement("div");
        textContainerElement.setAttribute("class", "task-text-container");
        // NAME
        titleElement = document.createElement("h3");
        titleElement.setAttribute("class", "task-title");
        titleElement.appendChild(document.createTextNode(task.title));
        textContainerElement.append(titleElement);
        // DESC
        descElement = document.createElement("p");
        descElement.setAttribute("class", "task-desc");
        descElement.appendChild(document.createTextNode(task.desc));
        textContainerElement.append(descElement);
        // DELETE BUTTON
        DeleteBtnElement = document.createElement("button");
        DeleteBtnElement.setAttribute("class", "btn-icon delete-task-btn hover-scale");
        // APPEND ELEMENTS TO TASK LI
        liElement.appendChild(checkboxElement);
        liElement.append(textContainerElement)
        liElement.appendChild(DeleteBtnElement);
        return liElement;
    }
}
