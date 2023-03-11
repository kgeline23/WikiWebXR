/*!
* Start Bootstrap - Clean Blog v6.0.8 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/

import * as BABYLON from "babylonjs";
import * as BABYLONGUI from "babylonjs-gui";
import 'babylonjs-loaders';

import { teleportationPatterns, hotspotPattern, locomotionPattern } from "./navigations";
import { ICustomScene, ISceneInfo } from "./interfaces";

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
            mainNav.classList.remove('is-visible');
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });
});

export const sceneInfo: ISceneInfo = 
{
    curScene : null,
    advancedTexture : null,
    sceneConference : null,
    sceneOffice : null,    
    sceneOpen : null,
    defaultXRExperience : null
}

export const createNavButtons = async function()
{
    const stackPanel = new BABYLONGUI.StackPanel();
    stackPanel.isVertical = true;
    stackPanel.width = "100px";
    stackPanel.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_CENTER;
    stackPanel.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    sceneInfo.advancedTexture.addControl(stackPanel);  

    const buttonHotspot = BABYLONGUI.Button.CreateSimpleButton("but", "Hotspot");
    buttonHotspot.width = "80px";
    buttonHotspot.height = "30px";
    buttonHotspot.color = "white";
    buttonHotspot.background = "grey";
    stackPanel.addControl(buttonHotspot);
    buttonHotspot.onPointerDownObservable.add(
        function()
        {
            hotspotPattern(sceneInfo.defaultXRExperience, sceneInfo.curScene);
        }
    );
    const buttonTeleportation = BABYLONGUI.Button.CreateSimpleButton("but", "Tele");
    buttonTeleportation.width = "80px";
    buttonTeleportation.height = "30px";
    buttonTeleportation.color = "white";
    buttonTeleportation.background = "grey";
    stackPanel.addControl(buttonTeleportation);
    buttonTeleportation.onPointerDownObservable.add(
        function()
        {
            teleportationPatterns(sceneInfo.defaultXRExperience, sceneInfo.curScene);  
        }
    );
    const buttonLocomotion = BABYLONGUI.Button.CreateSimpleButton("but", "Loco");
    buttonLocomotion.width = "80px";
    buttonLocomotion.height = "30px";
    buttonLocomotion.color = "white";
    buttonLocomotion.background = "grey";
    stackPanel.addControl(buttonLocomotion);
    buttonLocomotion.onPointerDownObservable.add(
        function()
        {
            locomotionPattern(sceneInfo.defaultXRExperience, sceneInfo.curScene);      
        }
    );
}

let clicks = 0; 
let xrExperiences: BABYLON.WebXRDefaultExperience[] = [];
export const createGUI = async function()
{
    if (sceneInfo.advancedTexture !== null)
        sceneInfo.advancedTexture.dispose(); 
    sceneInfo.advancedTexture = BABYLONGUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, sceneInfo.curScene);      
    
    //sceneInfo.advancedTexture = LoadScene(sceneInfo.curScene);

    //Button to change scenes
    let buttonScene = BABYLONGUI.Button.CreateSimpleButton("but", "Scene #" + (clicks % 3));
    buttonScene.width = 0.2;
    buttonScene.height = "40px";
    buttonScene.color = "white";
    buttonScene.background = "grey";
    buttonScene.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP
    sceneInfo.advancedTexture.addControl(buttonScene);
    buttonScene.onPointerDownObservable.add(
        function()
        {
            clicks++;
            switch (clicks % 3) {
                default:
                case 0:
                    sceneInfo.curScene = sceneInfo.sceneOpen;
                    createGUI();                                            
                    break;
                case 1:
                    sceneInfo.curScene = sceneInfo.sceneOffice;
                    createGUI();                                            
                    break;
                case 2:  
                    sceneInfo.curScene = sceneInfo.sceneConference;
                    createGUI();                                            
                    break;
                    // case 3:  
                    // sceneInfo.curScene = sceneInfo.sceneSelfOff ; //TODO: remove
                    // createGUI();                                            
                    // break;
                    // case 4:  
                    // sceneInfo.curScene = sceneInfo.sceneSelfCon ; //TODO: remove
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
    let button = BABYLONGUI.Button.CreateSimpleButton("butInspect", "Inspector");
    button.width = 0.2;
    button.height = "40px";
    button.color = "white";
    button.background = "gray";
    button.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    sceneInfo.advancedTexture.addControl(button);
    button.onPointerDownObservable.add(
        function()
        {
            //inspector just for editing, REMOVE LATER
            if (sceneInfo.curScene.debugLayer.isVisible())
                sceneInfo.curScene.debugLayer.hide();
            else
                sceneInfo.curScene.debugLayer.show();
        }
    );

    if(sceneInfo.curScene.navigation)
    {  
        createNavButtons();
    }
    
    //init vr
    if (!!xrExperiences[clicks % 3]) {
        sceneInfo.defaultXRExperience = xrExperiences[clicks % 3];
    }
    else {
        sceneInfo.defaultXRExperience = await sceneInfo.curScene.createDefaultXRExperienceAsync({
            floorMeshes: sceneInfo.curScene.floorMeshes
        });
        if (!sceneInfo.defaultXRExperience.baseExperience) {
            // no xr support
            throw new Error("no xr available on this device, install the webXR API emulator");
        } else {
            // VR available 
            try {
                sceneInfo.defaultXRExperience.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", { xrInput: sceneInfo.defaultXRExperience.input });
            } catch (err) {
                console.log("Articulated hand tracking not supported in this browser.");
            }
            sceneInfo.defaultXRExperience.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {                 
                sceneInfo.curScene.camera = xrCamera;
            });
            locomotionPattern(sceneInfo.defaultXRExperience, sceneInfo.curScene);  
            //rayCasting(sceneInfo.curScene);
        }
        xrExperiences[clicks % 3] = sceneInfo.defaultXRExperience;
    }
}

export interface ILoadEntityProps {
    scaling?: BABYLON.Vector3;
    position?: BABYLON.Vector3;
}
//load models used in office, multi office and conference scenes
export const LoadEntity = function (name: string, meshNameToLoad: string, url: string, file: string, manager: BABYLON.AssetsManager, meshArray: BABYLON.AbstractMesh[], props?: ILoadEntityProps) 
{
    const meshTask = manager.addMeshTask(name, meshNameToLoad, url, file);

    meshTask.onSuccess = function (task) 
    {
        if (task.loadedMeshes.length > 0) {
            meshArray = task.loadedMeshes;   
            meshArray.map((mesh) => {
                mesh.checkCollisions = true;
                if (props) 
                {
                    if (props.scaling) 
                    {
                        mesh.scaling.copyFrom(props.scaling);
                    }
                    if (props.position) 
                    {
                        mesh.position.copyFrom(props.position);
                    }
                }    
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

export const CreateScene = function(engine: BABYLON.Engine, nav: boolean)
{
    const scene = new BABYLON.Scene(engine) as ICustomScene;
    
    // const gravityVector = new BABYLON.Vector3(0, -9.8, 0);
    const gravityVector = new BABYLON.Vector3(0, -2, 0);
    const physicsPlugin = new BABYLON.CannonJSPlugin(); //different plugins available such as OimoJSPlugin and AmmoJSPlugin 
    scene.enablePhysics(gravityVector, physicsPlugin);

    scene.navigation = nav; //this will differentiate between free moving or stationary scenes for navigation
    const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);	
    return scene;
}

let advancedTexture: BABYLONGUI.AdvancedDynamicTexture | null = null;
export const LoadScene = function(curScene: ICustomScene)
{
    if (advancedTexture !== null)
        advancedTexture.dispose(); 
    advancedTexture = BABYLONGUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, curScene);
    return advancedTexture;
}

export const getHotspots = function(scene: ICustomScene)
{
    const spots = scene.getNodeByName("hotspots").getChildMeshes();
    let hotspots: BABYLON.Vector3[] = [];
    spots.forEach(element => {
        element.computeWorldMatrix(true);
        const vec = element.getAbsolutePosition();
        hotspots.push(new BABYLON.Vector3(vec.x, 0, vec.z)); //assuming ground is at 0, then hotspots are 0 too
    });	
    return hotspots;
}

export const getMesh = function(scene: ICustomScene, name: string, mass: number = 0, pickable=false)
{
    const mesh = scene.getNodeByName(name) as BABYLON.AbstractMesh;
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

export const setSceneCamera = function(scene: ICustomScene, startPosition?: BABYLON.Vector3)
{
    let sceneCamera = scene.getCameraByName("sceneCamera") as BABYLON.WebXRCamera;
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


