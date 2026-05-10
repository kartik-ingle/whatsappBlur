console.log("CONTENT SCRIPT RUNNING");

const STORAGE_KEY = "wa_styler_enabled";
const STYLE_ID = "wa-styler-styler-link";

// Function to inject CSS into the page
function injectCSS() {
    if(document.getElementById(STYLE_ID)) return; 

    const link = document.createElement("link");
    link.id = STYLE_ID;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = chrome.runtime.getURL("style.css");
    if(document.head) document.head.appendChild(link);
}

// Function to remove injected CSS
function removeCSS() {
    const existingLink = document.getElementById(STYLE_ID);
    if(existingLink) existingLink.remove();
}

function applyState(enabled) {
    if(enabled) injectCSS();
    else removeCSS();
}

//initial load (check stored preference)
chrome.storage.local.get([STORAGE_KEY], (result) => {
    const enabled = result[STORAGE_KEY] !== false ; // default to true if not set
    applyState(enabled);
})

// Listen for changes in storage to update the CSS in real-time
chrome.runtime.onMessage.addListener((message) => {
    if(message.type === "TOGGLE_STYLE") applyState(message.enabled);
})

