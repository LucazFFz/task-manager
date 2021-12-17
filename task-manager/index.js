window.onload = function() {
    taskHandler.init();
}

// UNDERLINE TAKER INPUT WHEN FOCUSING ON INPUT TEXT OR ADD TASK BTN
let getTaskerInput = document.querySelector("#tasker-input");
let getInputBtn = document.querySelector("#add-task-btn");
let getInputText = document.querySelector("#input-text");
getInputText.addEventListener("focusin", focusIn);
getInputText.addEventListener("focusout", focusOut);
getInputBtn.addEventListener("focusin", focusIn);
getInputBtn.addEventListener("focusout", focusOut);

function focusIn() {
    getTaskerInput.classList.add("focus");
}

function focusOut() {
    getTaskerInput.classList.remove("focus");

}


