//--------------------------------------- Attributes ------------------------------------------
let activeState = false;
//let tabs = [];
//let currentTabID;

//--------------------------------------- Listeners ------------------------------------------
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.url) {
        //currentTabID = tabId;
        console.log("service_worker.js INFO: Tab " + tabId + ": URL changed to " + changeInfo.url);

        if (activeState) {
            randomizeBadge();
        } else {
            chrome.action.setBadgeText({text: null});
        }
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        //currentTabID = tab.id
        console.log("service_worker.js INFO: Active Tab changed to: " + tab.id + " with URL: " + tab.url);

        if (activeState) {
            randomizeBadge();
        } else {
            chrome.action.setBadgeText({text: null});
        }
    });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.getState === "state") {
            if (activeState === false) {
                sendResponse({state: "False"});
            } else if (activeState === true) {
                sendResponse({state: "True"});
            }
            console.log(request.sender + " INFO: Called getState. Response: " + activeState);
        } else if (request.setActiveState === "True") {
            activeState = true;
            chrome.action.setIcon({
                path: {
                    '16': '../icons/color-16.png',
                    '48': '../icons/color-48.png',
                    '128': '../icons/color-128.png'
            }})
            sendResponse({state: "True"});
            console.log(request.sender + " INFO: Set activeState to: " + activeState);
        } else if (request.setActiveState === "False") {
            activeState = false;
            chrome.action.setIcon({
                path: {
                    '16': '../icons/sw-16.png',
                    '48': '../icons/sw-48.png',
                    '128': '../icons/sw-128.png'
                }
            })
            sendResponse({state: "False"});
            console.log(request.sender + " INFO: Set activeState to: " + activeState);
        } else if (request.printToConsole === "1") {
            console.log(request.sender + " DEBUG: " + request.item.toString());
        } else {
            console.log("service_worker.js WARN: Message parse failed")
        }
    }
);
//--------------------------------------- initialisation ------------------------------------------



//--------------------------------------- functions ------------------------------------------
function randomizeBadge () {
    let max = Math.floor(Math.random() * 20);
    let batchText = Math.floor(Math.random() * max);
    if (batchText === 0) {
        batchText = "";
    }
    chrome.action.setBadgeText({text: batchText.toString()});
}

/*
function doInCurrentTab(tabCallback) {
    chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) { tabCallback(tabArray[0]); }
    );
}

function changeBadgeText (tabId) {
    if (tabs === null || tabs.length < 1) {
        doInCurrentTab( function(tab){ currentTabID = tab.id } );
        let currentURL;
        doInCurrentTab(function (tab) {currentURL = tab.url});
        let entry = [tabId, currentURL];

    }
    for (let i = 0; i < tabs.length; i++) {


    }

}
 */
