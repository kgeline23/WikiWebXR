import { LoadEntity, LoadScene } from "../js/scripts.js";

export const createConferenceScene = async function(engine, canvas) 
{
	return new Promise((resolve, reject) => {
		const capHeight = 1.7;
		const scene = new BABYLON.Scene(engine);
		scene.enablePhysics();
		scene.navigation = true; //this will differentiate between free moving or stationary scenes for navigation
		const avatar = BABYLON.MeshBuilder.CreateCapsule("avatar", {radius:0.25, height: capHeight}, scene);
		
		// let scene = LoadScene(engine, true, capHeight); //LoadScene found in scrips.js //navigation is possible, navigation = true
		// let avatar = scene.avatar;

		const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);
		//after ini 
		
		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh = [];
		//loadEntitiy definition in js/script.js
		LoadEntity("conference", "", "./assets/models/", "conferenceScene.glb", assetsManager, myMesh);
		
		assetsManager.load();
		assetsManager.onFinish = function (tasks) 
		{
			const room = scene.getNodeByName("room");
			if (room)
				room.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);

			//hotspot positions
			scene.hotspots = [];
			const spots = scene.getNodeByName("hotspots").getChildMeshes();
			spots.forEach(element => {
				element.computeWorldMatrix(true);
				const vec = element.getAbsolutePosition();
				scene.hotspots.push([vec.x, 0, vec.z]);
			});		
			
			//get floor/ground needed for navigation
			const ground = scene.getNodeByName("ground");
			if (ground)
				scene.floorMeshes = [ground];
			else console.log("no ground found");	

			//position avatar/camera on a hotspot
			avatar.setAbsolutePosition(new BABYLON.Vector3(scene.hotspots[0][0], capHeight/2, scene.hotspots[0][2])); // y needs to be half the height as its 0,0,0 is at its center 
			avatar.PhysicsImpostor = new BABYLON.PhysicsImpostor(avatar, BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 60, friction:0.0, restitution: 0}, scene);
			ground.PhysicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
			
			
			
			//disable sky and walls in model
			const lights = scene.getNodeByName("lights");
			const sky = scene.getNodeByName("sky");
			const sceneCamera = scene.getCameraByName("sceneCamera");
			if (sceneCamera) {
				sceneCamera.parent = avatar; 						//this attaches the camera to the avatar (capsule)
				sceneCamera.checkCollisions;
				scene.switchActiveCamera(sceneCamera, true);
			}

			if (lights)
				lights.setEnabled(false);
			if (sky)	
				sky.setEnabled(false);

			resolve(scene);

		};		

		assetsManager.onError = function (err) {
			reject(err);
		}
	});
}

/*
	hotspot positions
	[x= 0 , z = -2]
	[x= -5, z = 0]
	[x= 0 , z = 2]
	[x= 5 , z = 0]
	let interestingSpot0 = new BABYLON.Vector3(0, 1, -2);
    let interestingSpot1 = new BABYLON.Vector3(-5, 1, 0);
    let interestingSpot2 = new BABYLON.Vector3(0, 1, 2 );
    let interestingSpot3 = new BABYLON.Vector3(5, 1, 0 );
*/