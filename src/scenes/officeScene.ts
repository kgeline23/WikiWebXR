import * as BABYLON from "babylonjs";
import { LoadEntity, CreateScene, setSceneCamera, getMesh } from "../js/scripts";
import { createMainMenu } from "../js/interactions";

export const createOfficeScene = async function(engine: BABYLON.Engine, canvas: HTMLCanvasElement) 
{	
	return new Promise<BABYLON.Scene>((resolve, reject) => 
	{
		const nav = false;
		let scene = CreateScene(engine, nav); //this scene is a fixed scene, navigation = false

		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh:BABYLON.AbstractMesh[] = [];
		
		LoadEntity("office", "", "./assets/models/", "officeScene.glb", assetsManager, myMesh); //loadEntitiy definition in js/script.js
		assetsManager.load();
		assetsManager.onFinish = function (tasks) 
		{	
			setSceneCamera(scene);
			scene.camera.checkCollisions = false;
			// scene.camera.physicsImpostor = null;

			//room scaling and positioning
			let sky = scene.getNodeByName("sky");
			if (sky)		
				sky.setEnabled(false);
				
			//get floor/ground needed for navigation
			const ground = scene.getNodeByName("ground") as BABYLON.AbstractMesh;
			if (ground)	
				scene.floorMeshes = [ground];
			else console.log("no ground found");
			
			
			scene.menu = scene.getNodeByName("menu") as BABYLON.AbstractMesh;
			scene.menuScale = 3;
			createMainMenu(scene);
			resolve(scene);
		};

		assetsManager.onTaskError = function (err) {
			reject(err);
		}
	});
}