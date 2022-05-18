function Modal(modalElement, submitBtn, cancelBtn, fieldControls) {
    this.modalElement = modalElement;
    this.submitBtn = submitBtn;
    this.cancelBtn = cancelBtn;
    this.fieldControls = fieldControls;
    isDisplayed = false;

    this.setDefaultEvents();
}
Modal.prototype.toggleDisplayed = function() {
    isDisplayed = !isDisplayed;
    if(isDisplayed) {
        this.validateControls();
        this.modalElement.style.display = "block";
        this.fieldControls[0].focus();
    }
    else {
        this.submitBtn.disabled = true;
        this.modalElement.querySelectorAll(".form-field").forEach(form => {
            form.reset();
        });
        this.modalElement.style.display = "none";
    }
}
Modal.prototype.setSubmitEvent = function(submitFunc) {
    // SUBMIT BUTTON CLICK
    this.submitBtn.onclick = submitFunc;   
}
Modal.prototype.setDefaultEvents = function() {
    // CANCEL BUTTON CLICK
    this.cancelBtn.addEventListener("click", () => {
        this.toggleDisplayed();
    });
    // OUTSIDE MODAL CONTENT CLICK
    this.modalElement.addEventListener("click", event => {
        if(event.target == this.modalElement) this.toggleDisplayed();
    });
    // INPUTS CHANGE
    this.fieldControls.forEach(control => {
        control.addEventListener("input", this.validateControls.bind(this));
    });
}
Modal.prototype.setDefaultValues = function(func, focusField = this.fieldControls[0]) {
    func.bind(this)();
    focusField.focus();
    const length = this.fieldControls[0].defaultValue.length;
    try { this.fieldControls[0].setSelectionRange(length, length); }
    catch(e) {}
}
Modal.prototype.validateControls = function() {
    let valid = [];
    this.fieldControls.forEach(control => {
        valid.push(control.validity.valid);
    });
    if(!valid.includes(false)) this.submitBtn.disabled = false;
    else this.submitBtn.disabled = true;  
}
//----- MODAL INSTANCES -----
// ADD PROJECT MODAL
const addProjectModalElem = document.querySelector("#add-project-modal");
const addProjectModal = new Modal(
    addProjectModalElem,
    addProjectModalElem.querySelector("#submit-add-project-modal-btn"),
    addProjectModalElem.querySelector("#cancel-add-project-modal-btn"),
    addProjectModalElem.querySelectorAll(".form-field-control"),
);

// EDIT PROJECT MODAL
const editProjectModalElem = document.querySelector("#edit-project-modal");
const editProjectModal = new Modal(
    editProjectModalElem,
    editProjectModalElem.querySelector("#submit-edit-project-modal-btn"),
    editProjectModalElem.querySelector("#cancel-edit-project-modal-btn"),
    editProjectModalElem.querySelectorAll(".form-field-control"),
);
