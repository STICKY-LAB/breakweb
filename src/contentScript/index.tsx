import breakWeb from "./breakWeb";


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    breakWeb();
});