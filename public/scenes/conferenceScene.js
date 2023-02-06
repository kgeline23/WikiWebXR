import { LoadEntity, LoadScene, getHotspots, setSceneCamera} from "../js/scripts.js";

export const createConferenceScene = async function(engine, canvas) 
{
	return new Promise((resolve, reject) => {
		let scene = LoadScene(engine, true); //LoadScene found in scrips.js //navigation is possible, navigation = true
		scene.collisionsEnabled = true;

		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh = [];
		//loadEntitiy definition in js/script.js
		LoadEntity("conference", "", "./assets/models/", "conferenceScene.glb", assetsManager, myMesh);
		assetsManager.load();

		assetsManager.onFinish = function (tasks) 
		{
			//hotspot positions
			scene.hotspots = getHotspots(scene);		
			
			//get floor/ground needed for navigation
			const floor = scene.getNodeByName("ground");
			if (floor)
			{
				scene.floorMeshes = [floor];
				floor.physicsImpostor = new BABYLON.PhysicsImpostor(floor, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.8, restitution: 0.5, disableBidirectionalTransformation: true }, scene);
				floor.checkCollisions = true;
			}
			else console.log("no floor found");	
			
			//setting camera for scene
			setSceneCamera(scene);

			//floor wasnt identified as a collider soo a dummy ground was created
			var ground = BABYLON.MeshBuilder.CreateBox("ground", { width: 30, height: 0.2, depth: 30 }, scene);
			ground.position.y = 0;
			ground.isVisible = false;
			ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.8, restitution: 0.5, disableBidirectionalTransformation: true }, scene);
			ground.checkCollisions = true;

			resolve(scene);
		};		

		assetsManager.onError = function (err) {
			reject(err);
		}
	});
}
