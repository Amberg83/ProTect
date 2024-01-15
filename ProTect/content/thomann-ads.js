(async () => {
    const response = await chrome.runtime.sendMessage({printToConsole: "1", item: "connected", sender: "thomann-ads.js"});
    // do something with response here, not outside the function
    console.log(response);
})();
let pos1 = document.getElementsByClassName("fx-headline fx-headline--2 fx-space-bottom--s fx-text-align--center");
for (let pos1Key in pos1) {
    (async () => {
        const response = await chrome.runtime.sendMessage({printToConsole: "1", item: pos1Key, sender: "thomann-ads.js"});
        // do something with response here, not outside the function
        console.log(response);
    })();
}