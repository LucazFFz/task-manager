window.onload = function() {
    taskHandler.init();
}

// UNDERLINE WHEN FOCUSING ON INPUT TEXT
let getTaskerInput = document.querySelector("#tasker-input");
let getInputText = document.querySelector("#input-text");
getInputText.addEventListener("focusin", () => {
    getTaskerInput.classList.add("focus");
});
getInputText.addEventListener("focusout", () => {
    getTaskerInput.classList.remove("focus");
});




