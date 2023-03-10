import { LoadEntity, CreateScene, setSceneCamera, getMesh } from "../js/scripts.js";
import { createMainMenu } from "../js/interactions.js";

export const createOfficeScene = async function(engine, canvas) 
{	
	return new Promise((resolve, reject) => 
	{
		const nav = false;
		let scene = CreateScene(engine, nav); //this scene is a fixed scene, navigation = false

		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh = [];
		
		LoadEntity("office", "", "./assets/models/", "officeScene.glb", assetsManager, myMesh); //loadEntitiy definition in js/script.js
		assetsManager.load();
		assetsManager.onFinish = function (tasks) 
		{	
			setSceneCamera(scene);
			scene.camera.checkCollisions = false;
			scene.camera.physicsImpostor = null;

			//room scaling and positioning
			let sky = scene.getNodeByName("sky");
			if (sky)		
				sky.setEnabled(false);
				
			//get floor/ground needed for navigation
			const ground = scene.getNodeByName("ground");
			if (ground)	
				scene.floorMeshes = ground;
			else console.log("no ground found");
			
			
			scene.menu = scene.getNodeByName("menu");
			scene.menuScale = 3;
			createMainMenu(scene);
			resolve(scene);
		};

		assetsManager.onError = function (err) {
			reject(err);
		}
	});
}