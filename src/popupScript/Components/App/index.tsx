
import React from "react";
import style from "./index.module.scss";
import chromep from "chrome-promise";

function App() {
    async function breakWeb() {
        const tab = (await chromep.tabs.query({active:true, currentWindow:true}))[0];
        chrome.tabs.sendMessage(tab.id, "BREAK");
    }

    return (
        <div className={style.container}>
            <input type="button" value="BREAK" onClick={breakWeb}/>
        </div>
    )
}

export default App;