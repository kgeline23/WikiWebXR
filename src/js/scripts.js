/*!
* Start Bootstrap - Clean Blog v6.0.8 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/

import * as BABYLON from "babylonjs";
import * as BABYLONGUI from "babylonjs-gui";
import 'babylonjs-loaders';

BABYLON.GUI = BABYLONGUI;

import { teleportationPatterns, hotspotPattern, locomotionPattern } from "./navigations.js";
import { rayCasting } from "./interactions.js";

window.addEventListener('DOMContentLoaded', () => {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    const headerHeight = mainNav.clientHeight;
    window.addEventListener('scroll', function() {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if ( currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove(['is-visible']);
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });
});

export let sceneInfo = 
{
    curScene : null,
    advancedTexture : null,
    sceneConference : null,
    sceneOffice : null,    
    sceneOpen : null,  
    sceneSelfOff: null,  //TODO: remove
    sceneSelfCon: null,   //TODO: remove
    defaultXRExperience : null,   
}

export const createNavButtons = async function()
{
    const stackPanel = new BABYLON.GUI.StackPanel();
    stackPanel.isVertical = true;
    stackPanel.width = "100px";
    stackPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    stackPanel.horizontalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_LEFT;
    sceneInfo.advancedTexture.addControl(stackPanel);  

    const buttonHotspot = BABYLON.GUI.Button.CreateSimpleButton("but", "Hotspot");
    buttonHotspot.width = "80px";
    buttonHotspot.height = "30px";
    buttonHotspot.color = "white";
    buttonHotspot.background = "grey";
    stackPanel.addControl(buttonHotspot);
    buttonHotspot.onPointerDownObservable.add(
        function()
        {
            hotspotPattern(sceneInfo.defaultXRExperience, sceneInfo.curscene);
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
            teleportationPatterns(sceneInfo.defaultXRExperience, sceneInfo.curscene);  
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
            locomotionPattern(sceneInfo.defaultXRExperience, sceneInfo.curscene);      
        }
    );
}

let clicks = 0; 
let xrExperiences = {};
export const createGUI = async function()
{
    if (sceneInfo.advancedTexture !== null)
        sceneInfo.advancedTexture.dispose(); 
    sceneInfo.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, sceneInfo.curscene);      
    
    //sceneInfo.advancedTexture = LoadScene(sceneInfo.curscene);

    //Button to change scenes
    let buttonScene = BABYLON.GUI.Button.CreateSimpleButton("but", "Scene #" + (clicks % 3));
    buttonScene.width = 0.2;
    buttonScene.height = "40px";
    buttonScene.color = "white";
    buttonScene.background = "grey";
    buttonScene.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    sceneInfo.advancedTexture.addControl(buttonScene);
    buttonScene.onPointerDownObservable.add(
        function()
        {
            clicks++;
            switch (clicks % 3) {
                default:
                case 0:
                    sceneInfo.curscene = sceneInfo.sceneOpen;
                    createGUI();                                            
                    break;
                case 1:
                    sceneInfo.curscene = sceneInfo.sceneOffice;
                    createGUI();                                            
                    break;
                case 2:  
                    sceneInfo.curscene = sceneInfo.sceneConference;
                    createGUI();                                            
                    break;
                    // case 3:  
                    // sceneInfo.curscene = sceneInfo.sceneSelfOff ; //TODO: remove
                    // createGUI();                                            
                    // break;
                    // case 4:  
                    // sceneInfo.curscene = sceneInfo.sceneSelfCon ; //TODO: remove
                    // createGUI();                                            
                    // break;
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
    sceneInfo.advancedTexture.addControl(button);
    button.onPointerDownObservable.add(
        function()
        {
            //inspector just for editing, REMOVE LATER
            if (sceneInfo.curscene.debugLayer.isVisible())
                sceneInfo.curscene.debugLayer.hide();
            else
                sceneInfo.curscene.debugLayer.show();
        }
    );

    if(sceneInfo.curscene.navigation)
    {  
        createNavButtons();
    }
    
    //init vr
    if (!!xrExperiences[clicks % 3]) {
        sceneInfo.defaultXRExperience = xrExperiences[clicks % 3];
    }
    else {
        sceneInfo.defaultXRExperience = await sceneInfo.curscene.createDefaultXRExperienceAsync({
            floorMeshes: sceneInfo.curscene.floorMeshes
        });
        if (!sceneInfo.defaultXRExperience.baseExperience) {
            // no xr support
            throw new Error("no xr available on this device, install the webXR API emulator");
        } else {
            // VR available 
            try {
                sceneInfo.defaultXRExperience.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {xrInput: xr.input});
            } catch (err) {
                console.log("Articulated hand tracking not supported in this browser.");
            }
            sceneInfo.defaultXRExperience.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {                 
                sceneInfo.curscene.camera = xrCamera;
            });
            locomotionPattern(sceneInfo.defaultXRExperience, sceneInfo.curscene);  
            //rayCasting(sceneInfo.curscene);
        }
        xrExperiences[clicks % 3] = sceneInfo.defaultXRExperience;
    }
}

//load models used in office, multi office and conference scenes 
export const LoadEntity = function (name, meshNameToLoad, url, file, manager, meshArray, props) 
{
    var meshTask = manager.addMeshTask(name, meshNameToLoad, url, file);

    meshTask.onSuccess = function (task) 
    {
        if (task.loadedMeshes.length > 0) {
            meshArray[name] = task.loadedMeshes;
            meshArray[name].position = BABYLON.Vector3.Zero();
            meshArray[name].checkCollisions = true;
            if (props) 
            {
                if (props.scaling) 
                {
                    meshArray[name].scaling.copyFrom(props.scaling);
                }
                if (props.position) 
                {
                    meshArray[name].position.copyFrom(props.position);
                }
            }       
            meshArray.map((mesh) => {
                mesh.checkCollisions = true;
              });
        }
    }
    meshTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }
    meshArray.map((mesh) => {
        mesh.checkCollisions = true;
      });
}

export const CreateScene = function(engine, nav)
{
    const scene = new BABYLON.Scene(engine);
    
    // const gravityVector = new BABYLON.Vector3(0, -9.8, 0);
    const gravityVector = new BABYLON.Vector3(0, -2, 0);
    const physicsPlugin = new BABYLON.CannonJSPlugin(); //different plugins available such as OimoJSPlugin and AmmoJSPlugin 
    scene.enablePhysics(gravityVector, physicsPlugin);

    scene.navigation = nav; //this will differentiate between free moving or stationary scenes for navigation
    const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);	
    return scene;
}

let advancedTexture = null;
export const LoadScene = function(curScene)
{
    if (advancedTexture !== null)
    advancedTexture.dispose(); 
    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, curScene);
    return advancedTexture;
}

export const getHotspots = function(scene)
{
    const spots = scene.getNodeByName("hotspots").getChildMeshes();
    let hotspots = [];
    spots.forEach(element => {
        element.computeWorldMatrix(true);
        const vec = element.getAbsolutePosition();
        hotspots.push([vec.x, 0, vec.z]); //assuming ground is at 0, then hotspots are 0 too
    });	
    return hotspots;
}

export const getMesh = function(scene, name, mass, pickable=false)
{
    const mesh = scene.getNodeByName(name);
    if (mesh)
    {
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            mesh, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { ignoreParent: true, mass: mass}, //, friction: 0.8, restitution: 0.5, disableBidirectionalTransformation: false }, 
            scene
        );
        mesh.checkCollisions = true;
        mesh.isPickable = pickable;
        return mesh;
    }
    console.log("no " + name + " found");
    return null;
}

export const setSceneCamera = function(scene, startPosition)
{
    let sceneCamera = scene.getCameraByName("sceneCamera");
    if (sceneCamera) {
        sceneCamera.checkCollisions = true;
        sceneCamera.applyGravity = true;
        sceneCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
        sceneCamera.inputs.clear();
        sceneCamera.inputs.addMouse();
 
        scene.switchActiveCamera(sceneCamera, true);
        scene.camera = sceneCamera;        
    }
}


