//--------------------------------------- Attributes ------------------------------------------
let activeState = false;
let currentStat = 0;
let sessionStat = 0;
let theWholeEntry;
let nKlicks = 0;

//--------------------------------------- Listeners ------------------------------------------
/**
 * Logs whenever the current Tab is updated and changes stats accordingly
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.url) {
        //currentTabID = tabId;
        let message = "service_worker.js INFO: Tab " + tabId + ": URL changed to " + changeInfo.url;
        console.log(message);
        saveInformation(message);
        if (activeState) {
            if (changeInfo.url.includes("wanderlust.travel")){
                randomizeCurrentStat(1, 2);
            } else {
                randomizeCurrentStat(0, 5);
            }
            setColorIcon();
            nKlicks++;
        } else {
            chrome.action.setBadgeText({text: ""});
            setSwIcon();
            nKlicks++;
        }
    }
});

/**
 * Logs whenever the active Tab changes and updates stats accordingly
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        let message = "service_worker.js INFO: Active Tab changed to: " + tab.id + " with URL: " + tab.url;
        console.log(message);
        saveInformation(message);
        if (activeState) {
            if (tab.url.includes("wanderlust.travel")){
                randomizeCurrentStat(1, 2);
            } else {
                randomizeCurrentStat(0, 5);
            }
            setColorIcon();
            nKlicks++;
        } else {
            chrome.action.setBadgeText({text: ""});
            setSwIcon();
            nKlicks++;
        }
    });
});


/**
 * Reads messages from PopUp and Content Scripts and performs requested actions.
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.getState === "state") {
            // when getState is requested, send the current Activation State to the sender
            if (activeState === false) {
                sendResponse({state: "False", currentStat: currentStat, sessionStat: sessionStat});
            } else if (activeState === true) {
                sendResponse({state: "True", currentStat: currentStat, sessionStat: sessionStat});
            }
            let message = request.sender + " INFO: Called getState. Response: " + activeState;
            console.log(message);
            saveInformation(message);

        } else if (request.setActiveState === "True") {
            //change to colorful icon and set State to Active
            activeState = true;
            setColorIcon();
            sendResponse({state: "True"});
            let message = request.sender + " INFO: Set activeState to: " + activeState;
            console.log(message);
            saveInformation(message);
            nKlicks++;

        } else if (request.setActiveState === "False") {
            //change to grayscale icon and set state to inactive
            activeState = false;
            setSwIcon();
            sendResponse({state: "False"});
            let message = request.sender + " INFO: Set activeState to: " + activeState;
            console.log(message);
            saveInformation(message);
            nKlicks++;

        } else if (request.printToConsole === "1") {
            //just logs information send with this parameter
            let message = request.sender + " INFO: " + request.text;
            console.log(message);
            saveInformation(message);
            nKlicks++;
            console.log("service_worker.js INFO: Total Klicks recorded: " + nKlicks);

        } else {
            console.log("service_worker.js WARN: Message parse failed")
        }
    }
);
//--------------------------------------- initialisation ------------------------------------------




//--------------------------------------- functions ------------------------------------------
/**
 * Calculates the Stats shown in the PopUp and on the Badge
 */
function randomizeCurrentStat (minNum, maxNum) {
    let batchText;

    currentStat = Math.floor(Math.random() * maxNum);
    batchText = currentStat;
    if (currentStat < minNum) {
        currentStat = minNum;
        batchText = minNum;
    } else if (currentStat === 0) {
        batchText = "";
    }
    sessionStat = sessionStat + currentStat;

    chrome.action.setBadgeText({text: batchText.toString()});
}

function setColorIcon() {
    chrome.action.setIcon({
        path: {
            '16': '../icons/color-16.png',
            '48': '../icons/color-48.png',
            '128': '../icons/color-128.png'
        }})
}

function setSwIcon() {
    chrome.action.setIcon({
        path: {
            '16': '../icons/sw-16.png',
            '48': '../icons/sw-48.png',
            '128': '../icons/sw-128.png'
        }
    })
}

/**
 * Saves Logdata to a file on the persons computer
 * Does not work
 */
function saveInformation(message) {
    chrome.storage.local.get(["logData"], function(result) {
        var secondsSinceLastEntry;
        var date = new Date();
        var newEntry = {
            "time": date,
            "info": message
        }
        if (Object.keys(result).length === 0) {
            theWholeEntry = [];
            secondsSinceLastEntry = 4;
        } else {
            theWholeEntry = result["logData"];
            var lastEntry = theWholeEntry[theWholeEntry.length - 1];
            var timeOld = new Date(lastEntry.time);
            var timeNew = new Date(date);
            secondsSinceLastEntry = (timeNew - timeOld) / 1000;
        }
        if (secondsSinceLastEntry > 3) {
            theWholeEntry.push(newEntry)
        }

        chrome.storage.local.set({
            "logData": theWholeEntry
        });

    });
}
