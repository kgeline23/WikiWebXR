import { LoadEntity, LoadScene } from "../js/scripts.js";
export const createOpenScene = async function(engine, canvas) 
{
	return new Promise((resolve, reject) => 
	{
		const capHeight = 1.7;
		const scene = new BABYLON.Scene(engine);
		scene.enablePhysics();
		scene.navigation = true; //this will differentiate between free moving or stationary scenes for navigation
		const avatar = BABYLON.MeshBuilder.CreateCapsule("avatar", {radius:0.25, height: capHeight}, scene);
		const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);	

		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh = [];
		//loadEntitiy definition in js/script.js
		LoadEntity("open", "", "./assets/models/", "openScene.glb", assetsManager, myMesh);
		
		assetsManager.load();
		assetsManager.onFinish = function (tasks) 
		{
			//get floor/ground needed for navigation
			const ground = scene.getNodeByName("ground");
			if (ground)
				scene.floorMeshes = [ground];
			else console.log("no ground found");
			
			//hotspot positions
			scene.hotspots = [];
			const spots = scene.getNodeByName("hotspots").getChildMeshes();
			spots.forEach(element => {
				element.computeWorldMatrix(true);
				const vec = element.getAbsolutePosition();
				scene.hotspots.push([vec.x, 0, vec.y]);
			});
			avatar.setAbsolutePosition(new BABYLON.Vector3(scene.hotspots[0][0], capHeight/2, scene.hotspots[0][2])); // y needs to be half the height as its 0,0,0 is at its center 
			
			let sceneCamera = scene.getCameraByName("sceneCamera");
			if (sceneCamera) {
				sceneCamera.parent = avatar; 						//this attaches the camera to the avatar (capsule)
				sceneCamera.checkCollisions;
				scene.switchActiveCamera(sceneCamera, true);
			}
			resolve(scene);
		};

		assetsManager.onError = function (err) 
		{
			reject(err);
		}
	});
}