window.onload = function() {
    taskHandler.init();
}

// UNDERLINE TAKER INPUT WHEN FOCUSING ON TASKER INPUT
let getTaskerInput = document.querySelector("#tasker-input");
getTaskerInput.addEventListener("focusin", () => {
    getTaskerInput.classList.add("focus");
});
getTaskerInput.addEventListener("focusout", () => {
    getTaskerInput.classList.remove("focus");
});
