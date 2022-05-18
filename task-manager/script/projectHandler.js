projectHandler = {
    collapsed: false,
    projectList: [],
    currentProject: 0,
    getProjectContainerUl: document.querySelector(".collapse-container").children[0],
    setEvents: function() {
        
        //--- EVENTS ---
        // ADD PROJECT EVENT
        const getAddProjectBtn = document.querySelector("#add-project-btn");
        getAddProjectBtn.addEventListener("click", () => {
            addProjectModal.toggleDisplayed();
            addProjectModal.setSubmitEvent(() => {
                this.add(addProjectModal.fieldControls[0].value, addProjectModal.fieldControls[1].value);
                addProjectModal.toggleDisplayed();
            });
            addProjectModal.setDefaultValues(() => {
                addProjectModal.fieldControls[1].defaultValue = "#d46211";
            })
        });
        // EDIT PROJECT EVENT
        projectHandler.getProjectContainerUl.addEventListener("click", event => {
            if(event.target.classList.contains("edit-project-btn")) {
                editProjectModal.toggleDisplayed();
                const id = parseInt(event.target.parentNode.parentNode.getAttribute("data-id"));
                editProjectModal.setSubmitEvent(() => {
                    this.edit(id, {
                        title: editProjectModal.fieldControls[0].value,
                        color: editProjectModal.fieldControls[1].value
                    });
                    editProjectModal.toggleDisplayed();
                });
                const project = this.projectList.filter(project => project.id === Number(id))[0];
                console.log(project);
                editProjectModal.setDefaultValues(() => {
                    editProjectModal.fieldControls[0].defaultValue = project.title;
                    editProjectModal.fieldControls[1].defaultValue = project.color;
                });
            }
        });
        
        // CHANGE PROJECT
        projectHandler.getProjectContainerUl.addEventListener("click", event => {
            if(event.target && event.target.hasAttribute("data-id")) {
                    let id = event.target.getAttribute("data-id");
                    let project = projectHandler.projectList.filter(x => x.id == id)[0];
                    projectHandler.change(project);   
            }
        });
        // TOGGLE COLLAPSE
        document.addEventListener("click", event => {
            if(event.target && event.target.id == "projects-toggle-collapse-cb") {
                document.querySelector(".collapse-container").classList.toggle("collapsed");
            }
        });
        //--- CUSTOM EVENTS ---
        // TASK ADDED
        document.addEventListener("section:task-added", () => {
            this.render(this.currentProject);
        });
        // TASK DELETED
        document.addEventListener("section:task-deleted", () => {
            this.render(this.currentProject);
        });
        // TASK COMPLETED
        document.addEventListener("section:task-completed", () => {
            this.render(this.currentProject);
        })
    },
    add: function(title, color) {
        const id = this.projectList.length + 100
        this.projectList.push(new Project(id, title, [], color));
        this.currentProject = this.projectList[this.projectList.length - 1];
        this.render(this.currentProject);
    },
    edit: function(id, obj) {
        const index = this.projectList.findIndex(project => project.id === Number(id));
        newProject = new Project(id, obj.title, this.projectList[index].sectionList, obj.color);
        this.projectList.splice(index, 1, newProject);
        this.render(newProject);
    },
    delete: function() {

    },
    change: function(project) {
        let projectItems = document.querySelectorAll(".project");
        projectItems.forEach(project => {
            project.classList.remove("selected");
        });

        let sections = document.querySelector("#sections");
        sections.innerHTML = "";

        let header = document.querySelector("#header-text")
        header.innerText = project.title;

        let selectedProjectElement = document.querySelector(`[data-id='${project.id}']`)
        selectedProjectElement.classList.add("selected");

        this.currentProject = project;
        project.renderAllSections();
    },  
    render: function(project) {

        const item = document.querySelector(`[data-id="${project.id}"]`)
        if(item) {
            this.getProjectContainerUl.replaceChild(buildHTML(), item);
        }
        else this.getProjectContainerUl.append(buildHTML());

        function buildHTML() {
            let liElement, titleElement
            // NEW LI ELEMENT
            liElement = document.createElement("li");
            liElement.setAttribute("data-id", project.id);
            liElement.setAttribute("class", "project");
            // COLOR
            let colorElem = document.createElement("div");
            colorElem.setAttribute("class", "project-color");
            colorElem.style.backgroundColor = project.color;
            liElement.append(colorElem);
            // NEW NAME ELEMENT
            titleElement = document.createElement("p");
            titleElement.setAttribute("class", "project-title");
            titleElement.append(document.createTextNode(project.title));
            // CONTAINER
            let container = document.createElement("div");
            // TASKS LEFT COUNTER
            if(project.tasksLeft() != 0) {
                let tasksLeftCounter = document.createElement("p");
                tasksLeftCounter.setAttribute("class", "project-tasks-left-counter");
                tasksLeftCounter.innerText = project.tasksLeft();
                container.append(tasksLeftCounter);
            }
            // EDIT 
            let edit = document.createElement("button");
            edit.setAttribute("class", "edit-project-btn btn-icon");

            container.append(edit);
            // APPEND TO PROJECT CONTAINER
            liElement.append(titleElement);
            liElement.append(container);

            return liElement;
        }
        
        this.change(project);
        project.setEvents();
    },
    renderAll: function() {
        this.projectList.forEach(project => {
            this.render(project);
        });
    }
}

window.onload = function() {
    // INIT
    projectHandler.setEvents();
    projectHandler.add("Welcome👋", "#F6BF31");
}   

// ADD SECTION
const getAddSectionBtn = document.querySelector("#add-section-btn");
getAddSectionBtn.addEventListener("click", event => {
    const name = document.querySelector("#add-section-name").value;
    projectHandler.currentProject.addSection(name);
});