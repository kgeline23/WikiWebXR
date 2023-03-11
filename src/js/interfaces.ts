import { AbstractMesh, Node, Scene, StandardMaterial, Vector3, WebXRCamera, WebXRDefaultExperience } from "babylonjs";
import { AdvancedDynamicTexture } from "babylonjs-gui";

export interface ICustomScene extends Scene {
    camera?: WebXRCamera;
    navigation?: boolean;
    floorMeshes?: AbstractMesh[];
    menu?: AbstractMesh;
    menuScale?: number;
    hotspots?: Vector3[];
    meshMaterial?: StandardMaterial;
}

export interface ISceneInfo {
    curScene?: ICustomScene;
    advancedTexture?: AdvancedDynamicTexture,
    sceneConference?: ICustomScene,
    sceneOffice?: ICustomScene,    
    sceneOpen?: ICustomScene,
    defaultXRExperience?: WebXRDefaultExperience
}