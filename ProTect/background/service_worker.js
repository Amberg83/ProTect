chrome.tabs.onUpdated.addListener(handleUpdated);
let activeState = false;


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.getState === "state") {
            if (activeState === false) {
                sendResponse({state: "False"});
            } else if (activeState === true) {
                sendResponse({state: "True"});
            }
            console.log("Responded to getState Request with: " + activeState);
        } else if (request.setActiveState === "True") {
            activeState = true;
            chrome.action.setIcon({
                path: {
                    '16': '../icons/color-16.png',
                    '48': '../icons/color-48.png',
                    '128': '../icons/color-128.png'
            }})
            sendResponse({state: "True"});
            console.log("Set activeState to: " + activeState);
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
            console.log("Set activeState to: " + activeState);
        }
    }
);
//--------------------------------------- initialisation ------------------------------------------



//--------------------------------------- functions ------------------------------------------
function randomizeBadge () {
    let max = Math.floor(Math.random() * 20);
    let batchText = Math.floor(Math.random() * max);
    if (batchText === 0) {
        batchText = 1;
    }
    chrome.action.setBadgeText({text: batchText.toString()});
}

function handleUpdated(tabId, changeInfo, tabInfo) {
    if (changeInfo.url) {
        console.log(`Tab: ${tabId} URL changed to ${changeInfo.url}`);
        if (activeState) {
            randomizeBadge();
        } else {
            chrome.action.setBadgeText({text: null});
        }
    }
}