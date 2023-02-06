import { LoadEntity, LoadScene, setSceneCamera } from "../js/scripts.js";

export const createOfficeScene = async function(engine, canvas) 
{	
	return new Promise((resolve, reject) => 
	{
		let scene = LoadScene(engine, false); //this scene is a fixed scene, navigation = false

		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh = [];
		
		LoadEntity("office", "", "./assets/models/", "officeScene.glb", assetsManager, myMesh); //loadEntitiy definition in js/script.js
		assetsManager.load();
		assetsManager.onFinish = function (tasks) 
		{	
			setSceneCamera(scene);

			//room scaling and positioning
			let sky = scene.getNodeByName("sky");
			if (sky)		
				sky.setEnabled(false);
				
			//get floor/ground needed for navigation
			const ground = scene.getNodeByName("ground");
			if (ground)	
				scene.floorMeshes = ground;
			else console.log("no ground found");	
			resolve(scene);
		};

		assetsManager.onError = function (err) {
			reject(err);
		}
	});
}