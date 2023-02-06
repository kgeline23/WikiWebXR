import { LoadEntity } from "../js/scripts.js";

export const createMultiOfficeScene = async function(engine, canvas) 
{
	return new Promise((resolve, reject) => 
	{
		let scene = new BABYLON.Scene(engine);	
		// camera
		const camera = new BABYLON.ArcRotateCamera("Camera", -2.9, 0.86, 8, new BABYLON.Vector3(0, 0, 4.5), scene);
		camera.attachControl(canvas, true);
		const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);
		scene.navigation = true; //this will differentiate between free moving or stationary scenes for navigation
		
		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh = [];
		//loadEntitiy definition in js/script.js
		LoadEntity("multioffice", "", "./assets/models/", "multiofficeScene.glb", assetsManager, myMesh);
		
		assetsManager.load();
		scene.floorMeshes = myMesh;

		assetsManager.onFinish = function (tasks) 
		{
			//room scaling and positioning
			let sky = scene.getNodeByName("sky");
			if (sky)		
				sky.setEnabled(false);
			const ground = scene.getNodeByName("ground");
			if (ground)
				scene.floorMeshes = [ground];
			resolve(scene);
		};	
		
		assetsManager.onError = function (err) {
			reject(err);
		}
	});
}