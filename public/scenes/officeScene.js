import { LoadEntity, LoadScene } from "../js/scripts.js";

export const createOfficeScene = async function(engine, canvas) 
{	
	return new Promise((resolve, reject) => 
	{
		const capHeight = 1.7;
		let scene = LoadScene(engine, false, capHeight); //this scene is a fixed scene, navigation = false
		let avatar = scene.avatar;
		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh = [];
		//loadEntitiy definition in js/script.js
		LoadEntity("office", "", "./assets/models/", "officeScene.glb", assetsManager, myMesh);
		
		assetsManager.load();
		assetsManager.onFinish = function (tasks) 
		{
			const room = scene.getNodeByName("room");
			if (room)
			{
				room.scaling = new BABYLON.Vector3(0.0015, 0.0015, 0.0015);
			}
			const hotspot = scene.getNodeByName("hotspot");
			if (hotspot)
			{
				hotspot.computeWorldMatrix(true);
				const vec = hotspot.getAbsolutePosition();
				avatar.setAbsolutePosition(new BABYLON.Vector3(vec.x, (vec.y + capHeight/2), vec.z));
			}

			const sceneCamera = scene.getCameraByName("sceneCamera");
			if (sceneCamera) {
				sceneCamera.parent = avatar; 						//this attaches the camera to the avatar (capsule)
				sceneCamera.checkCollisions;
				scene.switchActiveCamera(sceneCamera, true);
			}

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