const cookie_banner = document.getElementById("cookie-alert-container");

(async () => {
    const response = await chrome.runtime.sendMessage({printToConsole: "1", item: cookie_banner, sender: "displateCS.js"});
    // do something with response here, not outside the function
    console.log(response);
})();

let pos1 = document.getElementsByClassName("brand-page__title").item(0);
pos1.insertAdjacentHTML("afterend", "HalloFreunde");
