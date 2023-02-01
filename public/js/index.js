//Imports for Babylon and scenes
import "https://cdn.babylonjs.com/babylon.js";
import "https://cdn.babylonjs.com/gui/babylon.gui.js";
import "https://cdn.babylonjs.com/loaders/babylonjs.loaders.js";
import "https://unpkg.com/earcut@2.1.1/dist/earcut.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js";
import { createOpenScene } from "../scenes/openScene.js";
import { createMultiOfficeScene } from "../scenes/multiofficeScene.js";
import { createConferenceScene } from "../scenes/conferenceScene.js";
import { createOfficeScene } from "../scenes/officeScene.js";
import { teleportationPatterns, hotspotPattern, locomotionPattern } from "./navigations.js";
//import "./controller.js";

//Loading WebXR scene
const main = async () => {
    const canvas = document.getElementById("sceneCanvas");      //get the canvas element
    const engine = new BABYLON.Engine(canvas, true);            //generates the babylon 3D engine                            

    let sceneConference     = await createConferenceScene(engine, canvas);
    let sceneOpen           = await createOpenScene(engine, canvas);
    let sceneOffice         = await createOfficeScene(engine, canvas);
    //let sceneMultiOffice    = await createMultiOfficeScene(engine, canvas);

    let clicks = 0;                      
    let defaultXRExperience;
    let curScene = sceneConference;
    let xrExperiences = {};
    let advancedTexture = null;

    let createNavigation = async function()
    {
        const stackPanel = new BABYLON.GUI.StackPanel();
        stackPanel.isVertical = true;
        stackPanel.width = "100px";
        stackPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        stackPanel.horizontalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_LEFT;
        advancedTexture.addControl(stackPanel);  

        const buttonHotspot = BABYLON.GUI.Button.CreateSimpleButton("but", "Hotspot");
        buttonHotspot.width = "80px";
        buttonHotspot.height = "30px";
        buttonHotspot.color = "white";
        buttonHotspot.background = "grey";
        stackPanel.addControl(buttonHotspot);
        buttonHotspot.onPointerDownObservable.add(
            function()
            {
                hotspotPattern(defaultXRExperience, curScene);
            }
        );
        const buttonTeleportation = BABYLON.GUI.Button.CreateSimpleButton("but", "Tele");
        buttonTeleportation.width = "80px";
        buttonTeleportation.height = "30px";
        buttonTeleportation.color = "white";
        buttonTeleportation.background = "grey";
        stackPanel.addControl(buttonTeleportation);
        buttonTeleportation.onPointerDownObservable.add(
            function()
            {
                teleportationPatterns(defaultXRExperience, curScene);  
            }
        );
        const buttonLocomotion = BABYLON.GUI.Button.CreateSimpleButton("but", "Loco");
        buttonLocomotion.width = "80px";
        buttonLocomotion.height = "30px";
        buttonLocomotion.color = "white";
        buttonLocomotion.background = "grey";
        stackPanel.addControl(buttonLocomotion);
        buttonLocomotion.onPointerDownObservable.add(
            function()
            {
                locomotionPattern(defaultXRExperience, curScene);      
            }
        );
    }

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

        console.log(curScene.navigation);
        if(curScene.navigation)
        {  
            createNavigation();
        }
        else console.log("navigation not possible in this scene")
        
        //init vr
        if (!!xrExperiences[clicks % 3]) {
            defaultXRExperience = xrExperiences[clicks % 3];
        }
        else {
            defaultXRExperience = await curScene.createDefaultXRExperienceAsync({
                floorMeshes: curScene.floorMeshes
            });
            if (!defaultXRExperience.baseExperience) {
                // no xr support
                alert("no xr available on this device, install the webXR API emulator");
            } else {
                // VR available 
                defaultXRExperience.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {
                    xrCamera.setTransformationFromNonVRCamera();
                });

                hotspotPattern(defaultXRExperience, curScene);
            }
            xrExperiences[clicks % 3] = defaultXRExperience;
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