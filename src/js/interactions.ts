import * as BABYLON from "babylonjs";
import * as BABYLONGUI from "babylonjs-gui";
import {sceneInfo, createGUI} from "./scripts";
import { teleportationPatterns, hotspotPattern, locomotionPattern } from "./navigations";
import { ICustomScene } from "./interfaces";

// export const enableHandtracking = function()
// {
//     const xr = sceneInfo.defaultXRExperience;
//     const featureManager = xr.baseExperience.featuresManager;

//     const xrHandsFeature = featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
//         xrInput: xr.input,
//         jointMeshes: {
//             disableDefaultHandMesh: true,
//             enablePhysics: true,
//         },
//         physicsProps: {
//         impostorType: BABYLON.PhysicsImpostor.BoxImpostor,
//         friction: 0.5,
//         restitution: 0.3,
//         },
//     });
//     xrHandsFeature.onHandAddedObservable.add((newHand) => {
//         // celebrate, we have a new hand!
//         scene.onBeforeRenderObservable.add(() => {
//           // get the real world wrist position on each frame
//           console.log(newHand.trackedMeshes[0].position);
//         });
//     });

//     sceneInfo.curScene.onPointerObservable.add((evt) => {
//         const pointerId = evt.event.pointerId;
//         const xrController = xr.pointerSelection.getXRControllerByPointerId(pointerId);
//         const xrHandsObject = xrHandsFeature.getHandByControllerId(xrController.uniqueId);
//       });
// }

export const createMainMenu = (scene: ICustomScene) =>
{
    var manager = new BABYLONGUI.GUI3DManager(scene);
    manager.useRealisticScaling = true;
    // Create Near Menu with Touch Holographic Buttons + behaviour
    var nearMenu = new BABYLONGUI.NearMenu("NearMenu");
    if(navigation)
    {
        nearMenu.rows = 4;
    }
    else nearMenu.rows = 2;
    manager.addControl(nearMenu);
    nearMenu.scaling = new BABYLON.Vector3(scene.menuScale, scene.menuScale, scene.menuScale);
    nearMenu.isPinned = true;
    nearMenu.position = scene.menu.getAbsolutePosition();
    nearMenu.mesh.rotation = new BABYLON.Vector3(0, 1.5 * Math.PI, 0);

    addNearMenuButtons(nearMenu, scene.navigation);
}

let handClicked= false;
let navigation = false;
const addNearMenuButtons = function(menu: BABYLONGUI.NearMenu, nav: boolean) {
    navigation = nav;
    var btnConferenceScene  = new BABYLONGUI.TouchHolographicButton();
    var btnOpenScene        = new BABYLONGUI.TouchHolographicButton();
    var btnOfficeScene      = new BABYLONGUI.TouchHolographicButton();
    var btnHotspot          = new BABYLONGUI.TouchHolographicButton();
    var btnTele             = new BABYLONGUI.TouchHolographicButton();
    var btnLoco             = new BABYLONGUI.TouchHolographicButton();
    var btnRay              = new BABYLONGUI.TouchHolographicButton();
    //var btnHands            = new BABYLONGUI.TouchHolographicButton();

    //sceen buttons
    menu.addButton(btnConferenceScene);
    menu.addButton(btnOpenScene);
    menu.addButton(btnOfficeScene);

    //navigation buttons, some scenes are stationary  = no navigation
    if(nav)
    {
        menu.addButton(btnHotspot);
        menu.addButton(btnTele);
        menu.addButton(btnLoco);
    }
    //interaction buttons
    menu.addButton(btnRay);
    //menu.addButton(btnHands);

    btnConferenceScene.text = "Conference";
    btnOpenScene.text = "Open";
    btnOfficeScene.text = "Office";
    btnHotspot.text = "Hotspot ";
    btnTele.text = "Teleportation";
    btnLoco.text = "Locomotion";
    btnRay.text = "Raycast";
    //btnHands.text = "Hand tracking";

    btnConferenceScene.onPointerDownObservable.add(()=>
    {
        //change current scene to conference
        if (sceneInfo.curScene !== sceneInfo.sceneConference)
        {
            sceneInfo.curScene = sceneInfo.sceneConference;
            createGUI();
        }
    });
    btnOpenScene.onPointerDownObservable.add(()=>
    {
        //change current scene to Open
        if (sceneInfo.curScene !== sceneInfo.sceneOpen)
        {
            sceneInfo.curScene = sceneInfo.sceneOpen;
            createGUI();
        }
    });
    btnOfficeScene.onPointerDownObservable.add(()=>
    {
        //change current scene to Office
        if (sceneInfo.curScene !== sceneInfo.sceneOffice)
        {
            sceneInfo.curScene = sceneInfo.sceneOffice;
            createGUI();
        }
    });
    btnHotspot.onPointerDownObservable.add(()=>
    {
        //change navigation to hotspot
        hotspotPattern(sceneInfo.defaultXRExperience, sceneInfo.curScene);
    });
    btnTele.onPointerDownObservable.add(()=>
    {
        //change navigation to teleportation
        teleportationPatterns(sceneInfo.defaultXRExperience, sceneInfo.curScene);
    });
    btnLoco.onPointerDownObservable.add(()=>
    {
        //change navigation to locomotion
        locomotionPattern(sceneInfo.defaultXRExperience, sceneInfo.curScene);
    });
    btnRay.onPointerDownObservable.add(()=>
    {
        //add raycasting interaction
        //rayCasting(scene);
    });
    // btnHands.onPointerDownObservable.add(()=>
    // {
    //     //change hand tarking
    //     const featureManager = sceneInfo.defaultXRExperience.baseExperience.featuresManager;
    //     if (handClicked)
    //         featureManager.disableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING);
    //     else
    //         enableHandtracking();
    // });
};

// export const rayCasting = function(scene: ICustomScene)
// {
//     const resultRay = new BABYLON.Ray();
//     const xrInputSource = new XRInputSource();
//     const webXrInputSource = new BABYLON.WebXRInputSource(sceneInfo.curScene, xrInputSource);

//     // try to get the grip direction ray; If it's not available, it'll automatically fallback to the pointer direction ray:
//     webXrInputSource.getWorldPointerRayToRef(resultRay, true);

//     let rayHelper = new BABYLON.RayHelper(ray);
//     rayHelper.show(scene);

//     let hit = scene.pickWithRay(ray);

//     if (hit.pickedMesh){
//        hit.pickedMesh.scaling.y += 0.01;
//     }
// };


//add gizmo outlines and transformation of mesh
export const addGizmoBehavior = function(scene: ICustomScene, mesh: BABYLON.AbstractMesh)
{
  // Create utility layer and bounding box gizmo
  var utilLayer = new BABYLON.UtilityLayerRenderer(scene)
  utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;
  var gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#0984e3"), utilLayer)
  gizmo.rotationSphereSize = 0.025;
  gizmo.scaleBoxSize = 0.025;
  // Create behaviors to drag and scale with pointers in VR
  var sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
  mesh.addBehavior(sixDofDragBehavior);
  gizmo.attachedMesh = mesh;
  var multiPointerScaleBehavior = new BABYLON.MultiPointerScaleBehavior();
  mesh.addBehavior(multiPointerScaleBehavior);
};

//color change
export const addColorBehavior = function(scene: ICustomScene, mesh: BABYLON.AbstractMesh) {
        mesh.actionManager = new BABYLON.ActionManager(scene);
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            function(evt)
            {
                scene.meshMaterial.diffuseColor = BABYLON.Color3.Random();
            }
        ));
  };

  //moving mesh horizontally
export const addHorizontalBehavior = function(mesh: BABYLON.AbstractMesh) {
    //horizontal movement
    const dragBehavior = new BABYLON.PointerDragBehavior({dragAxis: new BABYLON.Vector3(1,0,0)});
    dragBehavior.useObjectOrientationForDragging = false;
    // Listen to drag events
    dragBehavior.onDragStartObservable.add((event)=>{
        console.log("dragStart");
    });
    dragBehavior.onDragObservable.add((event)=>{
        //console.log("drag");
    });
    dragBehavior.onDragEndObservable.add((event)=>{
        console.log("dragEnd");
    });

	mesh.addBehavior(dragBehavior);
};

export const create3DPanels = function(scene: BABYLON.Scene, title: string, content: string, position: BABYLON.Vector3, rotation: BABYLON.Vector3)
{
    const manager = new BABYLONGUI.GUI3DManager(scene);
    
    // This section shows how to use a HolographicSlate as a dialog box
    var slate = new BABYLONGUI.HolographicSlate("slate");
    
    slate.titleBarHeight = 0; // Hides default slate controls and title bar
    manager.addControl(slate);
    slate.minDimensions = new BABYLON.Vector2(0.5, 0.5);
    slate.dimensions = new BABYLON.Vector2(0.5, 0.5);
    //slate.position = new BABYLON.Vector3(0, 2, 0);
    slate.position = position
    slate.mesh.rotation = rotation;
    
    var contentGrid = new BABYLONGUI.Grid("grid");
    var button = BABYLONGUI.Button.CreateSimpleButton("center", "Alright!");
    var titles = new BABYLONGUI.TextBlock("title");
    var text = new BABYLONGUI.TextBlock("text");
    
    button.width = 0.5;
    button.height = 0.2;
    button.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    button.textBlock.color = "white";
    button.onPointerUpObservable.add(()=>{
        slate.dispose();
    });

    titles.height = 0.2;
    titles.color = "white";
    titles.textWrapping = BABYLONGUI.TextWrapping.WordWrap;
    titles.setPadding("5%", "5%", "5%", "5%");
    titles.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
    titles.text = title
    titles.fontWeight = "bold";

    text.height = 0.8;
    text.color = "white";
    text.textWrapping = BABYLONGUI.TextWrapping.WordWrap;
    text.setPadding("5%", "5%", "5%", "5%");
    text.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
    text.text = content;

    contentGrid.addControl(button);
    contentGrid.addControl(titles);
    contentGrid.addControl(text);
    contentGrid.background = "#000080";
    slate.content = contentGrid;
};
