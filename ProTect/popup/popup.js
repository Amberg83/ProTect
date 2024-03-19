let button = document.getElementById("toggleActiveState");
button.addEventListener("change", changeActiveState);
let activeState = "";
let currentStat = document.getElementById("currentlyBlockedValue");
let sessionStat = document.getElementById("sessionBlockedValue");


//--------------------------------------- on popup open execute ------------------------------
chrome.runtime.sendMessage({getState: "state", sender: "popup.js"}, function (response) {
        if (response.state === "False") {
            activeState = "False";
            currentStat.textContent = response.currentStat;
            sessionStat.textContent = response.sessionStat;
        } else if (response.state === "True") {
            activeState = "True";
            button.checked = true;
            currentStat.textContent = response.currentStat;
            sessionStat.textContent = response.sessionStat;
        }
            console.log(response);
        })

//--------------------------------------- functions ------------------------------------------
function setActiveState (value) {
    chrome.runtime.sendMessage({setActiveState: value, sender: "popup.js"});
}

function changeActiveState () {
    if (activeState === "True") {
        setActiveState("False");
        activeState = "False";
    } else if (activeState === "False") {
        setActiveState("True");
        activeState = "True";
    }
}

