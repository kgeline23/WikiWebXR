import { LoadEntity } from "../js/scripts.js";
export const createOfficeScene = async function(engine, canvas) 
{	
	return new Promise((resolve, reject) => 
		{
		let scene = new BABYLON.Scene(engine);	
		// camera
		//let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 4.5), scene);
		let camera = new BABYLON.ArcRotateCamera("Camera", -3.85, 0.72, 325.57, new BABYLON.Vector3(0, 0, 0), scene);
		//camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(canvas, true);

		let light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);	
		let assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh = [];
		//loadEntitiy definition in js/script.js
		LoadEntity("office", "", "./assets/models/room_office/", "scene.glb", assetsManager, myMesh);
		
		assetsManager.load();

		assetsManager.onFinish = function (tasks) 
		{
			//room scaling and positioning
			let sky = scene.getNodeByName("sky");
			if (sky)
			{			
				sky.setEnabled(false);
			}
			//get floor/ground needed for navigation
			const ground = scene.getNodeByName("floor");
			if (ground)
			{			
				scene.floorMeshes = ground;
			}
			else console.log("no ground found");			
			scene.camera = camera;
			resolve(scene);
		};

		assetsManager.onError = function (err) {
			reject(err);
		}
	});
}