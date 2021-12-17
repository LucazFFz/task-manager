window.onload = function() {
    taskHandler.init();
}

// UNDERLINE WHEN FOCUSING ON INPUT TEXT
let getTaskerInput = document.querySelector("#tasker-input");
let getInputText = document.querySelector("#input-text");
getInputText.addEventListener("focusin", () => {
    if(getInputText.value != "") getTaskerInput.classList.add("written");
});
getInputText.addEventListener("focusout", () => {
    getTaskerInput.classList.remove("focus");
});




