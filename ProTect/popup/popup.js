let button = document.getElementById("toggleActiveState");
button.addEventListener("change", changeActiveState);
let activeState = "";

(async () => {
    const response =
        await chrome.runtime.sendMessage({getState: "state", sender: "popup.js"}, function (response) {
        if (response.state === "False") {
            activeState = "False";
        } else if (response.state === "True") {
            activeState = "True";
            button.checked = true;
        }
        });
    console.log(response);
})();

//--------------------------------------- functions ------------------------------------------
function fSetActiveState (value) {
    (async () => {
        const response = await chrome.runtime.sendMessage({setActiveState: value, sender: "popup.js"});
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

