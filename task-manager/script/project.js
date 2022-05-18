function Project(id, title, sectionList, color = "#d46211") {
    this.id = id;
    this.title = title;
    this.sectionList = sectionList;
    this.color = color;

    this.init();
}
Project.prototype.init = function() {
    if(this.sectionList.length == 0) this.addSection("Default section", true);
}
Project.prototype.setEvents = function() {    
    //--- SET EVENTS ---
    // TOGGLE COLLAPSE EVENT
    const project = document.querySelector("#current-project");
    project.addEventListener("click", event => {
        if(event.target.classList.contains("section-toggle-collapse-cb")) {
            event.target.parentNode.parentNode.children[1].classList.toggle("collapsed");
        }
    });

    //--- CUSTOM EVENTS ---
    // TASK ADDED
    document.addEventListener("section:task-added", e => {
        this.render(e.detail.section);
    });
    // TASK DELETED
    document.addEventListener("section:task-deleted", e => {
        this.render(e.detail.section);
    });
    // TASK COMPLETED
    document.addEventListener("section:task-completed", e => {
        this.render(e.detail.section);
    })    
}
Project.prototype.addSection = function(title, isDefaultSection = false) {
    const id = parseInt(this.id.toString() + (this.sectionList.length + 200).toString());
    this.sectionList.push(new Section(id, title, [], isDefaultSection));
    const section = this.sectionList[this.sectionList.length - 1]
    this.render(section);
}
Project.prototype.tasksLeft = function() {
    let counter = 0;
    this.sectionList.forEach(section => {
        counter += section.tasksLeft();
    })
    return counter;
}
Project.prototype.render = function(section) {
    const sectionElement = document.querySelector("#sections");
    const item = document.querySelector(`[data-id="${section.id}"]`);
    if(item) {
        sectionElement.replaceChild(buildHTML(), item);
    }
    else {
        sectionElement.append(buildHTML());
    }
    
    function buildHTML() {
        let liElement, sectionNameElement, headerElement, cbElement, iElement, ulTaskElement
        //--- NEW LI ELEMENT ---
        liElement = document.createElement("li");
        liElement.setAttribute("data-id", section.id);
        liElement.setAttribute("class", "section");
        //--- HEADER ELEMENT ---
        if(!section.isDefaultSection) {
            headerElement = document.createElement("header");
            headerElement.setAttribute("class", "section-header");
            liElement.append(headerElement);
            // CHECKBOX
            cbElement = document.createElement("input");
            cbElement.setAttribute("type", "checkbox");
            cbElement.setAttribute("class", "section-toggle-collapse-cb cb");
            headerElement.append(cbElement);
            // TITLE
            sectionNameElement = document.createElement("h2");
            sectionNameElement.setAttribute("class", "section-title");
            sectionNameElement.append(document.createTextNode(section.title));
            headerElement.append(sectionNameElement);
            // TASKS LEFT COUNTER
            if(section.tasksLeft() != 0) {
                let tasksLeftCounter = document.createElement("p");
                tasksLeftCounter.setAttribute("class", "section-tasks-left-counter");
                tasksLeftCounter.innerText = section.tasksLeft();
                headerElement.append(tasksLeftCounter);   
            }
        }
        //--- UL ELEMENT ---
        div = document.createElement("div");
        div.setAttribute("class", "collapse-container");
        ulTaskElement = document.createElement("ul");
        ulTaskElement.setAttribute("class", "tasks");
        div.append(ulTaskElement);
        liElement.append(div);

        return liElement;
    }
    section.setEvents();
    section.renderAllTasks();
    section.renderAddTaskBtn();
}
Project.prototype.renderAllSections = function() {
        this.sectionList.forEach(section => {
        this.render(section);
    });
}