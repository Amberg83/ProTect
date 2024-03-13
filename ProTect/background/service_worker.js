//--------------------------------------- Attributes ------------------------------------------
let activeState = false;
let currentStat = 0;
let sessionStat = 0;
let allTimeStat = 0;
//let tabs = [];
//let currentTabID;

//--------------------------------------- Listeners ------------------------------------------
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.url) {
        //currentTabID = tabId;
        console.log("service_worker.js INFO: Tab " + tabId + ": URL changed to " + changeInfo.url);

        if (activeState) {
            if (changeInfo.url.includes("wanderlust.travel")){
                randomizeBadge(1, 2);
            } else {
                randomizeBadge(0, 5);
            }
            setColorIcon();
        } else {
            chrome.action.setBadgeText({text: ""});
            setSwIcon();
        }
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        //currentTabID = tab.id
        console.log("service_worker.js INFO: Active Tab changed to: " + tab.id + " with URL: " + tab.url);

        if (activeState) {
            if (tab.url.includes("wanderlust.travel")){
                randomizeBadge(1, 2);
            } else {
                randomizeBadge(0, 5);
            }
            setColorIcon();
        } else {
            chrome.action.setBadgeText({text: ""});
            setSwIcon();
        }
    });
});



chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.getState === "state") {
            if (activeState === false) {
                sendResponse({state: "False", currentStat: currentStat, sessionStat: sessionStat});
            } else if (activeState === true) {
                sendResponse({state: "True", currentStat: currentStat, sessionStat: sessionStat});
            }
            console.log(request.sender + " INFO: Called getState. Response: " + activeState);
        } else if (request.setActiveState === "True") {
            activeState = true;
            setColorIcon();
            sendResponse({state: "True"});
            console.log(request.sender + " INFO: Set activeState to: " + activeState);
        } else if (request.setActiveState === "False") {
            activeState = false;
            setSwIcon();
            sendResponse({state: "False"});
            console.log(request.sender + " INFO: Set activeState to: " + activeState);
        } else if (request.printToConsole === "1") {
            console.log(request.sender + " INFO: " + request.text);
        } else {
            console.log("service_worker.js WARN: Message parse failed")
        }
    }
);
//--------------------------------------- initialisation ------------------------------------------


//--------------------------------------- functions ------------------------------------------
function randomizeBadge (minNum, maxNum) {
    let max = Math.floor(Math.random() * maxNum);
    let batchText = Math.floor(Math.random() * max);
    currentStat = batchText;
    sessionStat = sessionStat + currentStat;
    if (batchText === 0 === minNum) {
        batchText = "";
    } else if (batchText < minNum) {
        batchText = minNum;
    }
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
