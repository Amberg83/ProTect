button = document.getElementById("colorButton");
button.addEventListener("click", changeActiveState);

let activeState = "";

(async () => {
    const response =
        await chrome.runtime.sendMessage({getState: "state", sender: "popup.js"}, function (response) {
        if (response.state === "False") {
            activeState = "False";
            button.textContent = "Plugin inactive";
            button.style.backgroundColor = "red";
        } else if (response.state === "True") {
            activeState = "True";
            button.textContent = "Plugin active";
            button.style.backgroundColor = "green";
        }
        });
    console.log(response);
})();

//--------------------------------------- functions ------------------------------------------
function fSetActiveState (value) {
    (async () => {
        const response = await chrome.runtime.sendMessage({setActiveState: value, sender: "popup.js"});
        if (value === "True") {
            button.textContent = "Plugin active";
            button.style.backgroundColor = "green";
        } else if (value === "False") {
            button.textContent = "Plugin inactive";
            button.style.backgroundColor = "red";
        }
        console.log(response);
    })();
}

function changeActiveState () {
    if (activeState === "True") {
        fSetActiveState("False");
        activeState = "False";
    } else if (activeState === "False") {
        fSetActiveState("True");
        activeState = "True";
    }
}