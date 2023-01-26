//Imports for Babylon and scenes
import "https://cdn.babylonjs.com/babylon.js";
import "https://cdn.babylonjs.com/gui/babylon.gui.js";
import "https://cdn.babylonjs.com/loaders/babylonjs.loaders.js";
import "https://unpkg.com/earcut@2.1.1/dist/earcut.min.js";
import { createOpenScene } from "../scenes/openScene.js";
import { createMultiOfficeScene } from "../scenes/multiofficeScene.js";
import { createConferenceScene } from "../scenes/conferenceScene.js";
import { createOfficeScene } from "../scenes/officeScene.js";
import { teleportationPatterns, hotspotPattern, locomotionPattern } from "./navigations.js";
import { LoadEntity } from "./scripts.js";
//import "./controller.js";

//Loading WebXR scene
const main = async () => {
    const canvas = document.getElementById("sceneCanvas");      //get the canvas element
    const engine = new BABYLON.Engine(canvas, true);            //generates the babylon 3D engine                            

    let sceneOpen           = await createOpenScene(engine, canvas);
    let sceneOffice         = await createOfficeScene(engine, canvas);
    let sceneConference     = await createConferenceScene(engine, canvas);
    //let sceneMultiOffice    = await createMultiOfficeScene(engine, canvas);

    let clicks = 0;
    let advancedTexture = null;                        
    let defaultXRExperience;
    let curScene = sceneConference;

    let createGUI = async function()
    {
        if (advancedTexture !== null)
            advancedTexture.dispose(); 
        advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, curScene);            
        //Button to change scenes
        let buttonScene = BABYLON.GUI.Button.CreateSimpleButton("but", "Scene #" + (clicks % 3));
        buttonScene.width = 0.2;
        buttonScene.height = "40px";
        buttonScene.color = "white";
        buttonScene.background = "grey";
        buttonScene.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        advancedTexture.addControl(buttonScene);
        buttonScene.onPointerDownObservable.add(
            function()
            {
                clicks++;
                switch (clicks % 3) {
                    default:
                    case 0:
                        curScene = sceneConference;
                        createGUI();                                            
                        break;
                    case 1:
                        curScene = sceneOpen;
                        createGUI();                                            
                        break;
                    case 2:  
                        curScene = sceneOffice;
                        createGUI();                                            
                        break;
                    /*
                    case 3:
                        createGUI(sceneMultiOffice);
                        sceneMultiOffice.render();
                        break;
                    */
                }
            }
        );
        
        //Button to open and close insprector
        let button = BABYLON.GUI.Button.CreateSimpleButton("butInspect", "Inspector");
        button.width = 0.2;
        button.height = "40px";
        button.color = "white";
        button.background = "gray";
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        advancedTexture.addControl(button);
        button.onPointerDownObservable.add(
            function()
            {
                //inspector just for editing, REMOVE LATER
                if (curScene.debugLayer.isVisible())
                    curScene.debugLayer.hide();
                else
                    curScene.debugLayer.show();
            }
        );
        
        //init vr
        defaultXRExperience = await curScene.createDefaultXRExperienceAsync({
            floorMeshes: curScene.floorMeshes
        });
        if (!defaultXRExperience.baseExperience) {
            // no xr support
            alert("no xr available on this device, install the webXR API emulator");
        } else {
            // all good, ready to go
            teleportationPatterns(defaultXRExperience, curScene.floorMeshes);
            //hotspotPattern(defaultXRExperience, curScene);
        }
    }	
    createGUI();
    //disable scrolling on webpage when curser on canvas
    if (canvas)
        canvas.addEventListener('wheel', (e) => {e.preventDefault()}, false);
    else console.log("No canvas found");
    engine.runRenderLoop(function()
    {
        curScene.render();
    });

    window.addEventListener("resize", function()
    {
        engine.resize();                            
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
})