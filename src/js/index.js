//Imports for Babylon and scenes
import { Engine } from "babylonjs";
import { sceneInfo, createGUI} from "./scripts.js";
import { createOpenScene } from "../scenes/openScene.js";
import { createConferenceScene } from "../scenes/conferenceScene.js";
import { createOfficeScene } from "../scenes/officeScene.js";

import * as CANNON from "cannon-es";

//import { createSelfOfficeScene, createSelfConferenceScene } from "../scenes/selfbuiltScene.js"; //TODO: remove

//import "./controller.js";
window.CANNON = CANNON;

//Loading WebXR scene
const main = async () => {
    const canvas = document.getElementById("sceneCanvas");      //get the canvas element
    const engine = new Engine(canvas, true);            //generates the babylon 3D engine
    
    // Display errors on page
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "#C33"
    document.querySelector(".sceneCanvas").after(errorDiv);

    const showError = (error, url, line) => {
        let errorBox = document.createElement("div");
        let errorMes = document.createElement("h3");
        errorMes.innerText = error;
        let errorLin = document.createElement("span");
        errorLin.innerText = "Line " + line + " in " + url;
        const hr = document.createElement("hr");
    
        errorBox.appendChild(errorMes);
        errorBox.appendChild(errorLin);
        errorBox.appendChild(hr);
    
        errorDiv.appendChild(errorBox);
    };
    
    window.onerror = function(error, url, line) {
        showError(error, url, line);
    };

    //get scenes asynchronously 
    const result = await Promise.allSettled([
        createConferenceScene(engine, canvas),
        createOfficeScene(engine, canvas),
        createOpenScene(engine, canvas),
        // createSelfOfficeScene(engine, canvas), //TODO: remove
        // createSelfConferenceScene(engine, canvas) //TODO: remove
    ]);

    //check if errors occured 
    result.forEach((promise) => {
        if (promise.status === "rejected") {
            showError(promise.reason.message, promise.reason.fileName, promise.reason.lineNumber);
            throw new Error(promise.reason);
        }
    })

    sceneInfo.sceneConference     = result[0].value; 
    sceneInfo.sceneOffice         = result[1].value; 
    sceneInfo.sceneOpen           = result[2].value;
    // sceneInfo.sceneSelfOff        = result[3].value; //TODO: remove
    // sceneInfo.sceneSelfCon        = result[3].value; //TODO: remove
    sceneInfo.curscene = sceneInfo.sceneOpen;
	
    createGUI();
    
    //disable scrolling on webpage when curser on canvas
    if (canvas)
        canvas.addEventListener('wheel', (e) => {e.preventDefault()}, false);
    else console.log("No canvas found");
    engine.runRenderLoop(function()
    {
        sceneInfo.curscene.render();
    });

    window.addEventListener("resize", function()
    {
        engine.resize();                            
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
})