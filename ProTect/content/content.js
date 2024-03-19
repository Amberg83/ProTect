document.addEventListener('click', function(event) {
    let element = event.target;
    let text = "User clicked on HTML Element: " + element.outerHTML;
    chrome.runtime.sendMessage({printToConsole: "1", sender: "content.js", text: text});
});

