import { LoadEntity, LoadScene, getHotspots, setSceneCamera } from "../js/scripts.js";

export const createOpenScene = async function(engine, canvas) 
{
	return new Promise((resolve, reject) => 
	{
		let scene = LoadScene(engine, true); //LoadScene found in scrips.js //navigation is possible, navigation = true


		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh = [];
		//loadEntitiy definition in js/script.js
		LoadEntity("open", "", "./assets/models/", "openScene.glb", assetsManager, myMesh);
		assetsManager.load();

		assetsManager.onFinish = function (tasks) 
		{
			//hotspot positions
			scene.hotspots = getHotspots(scene);	

			//get floor/ground needed for navigation
			const ground = scene.getNodeByName("ground");
			if (ground)
				scene.floorMeshes = [ground];
			else console.log("no ground found");
			ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.8, restitution: 0.5, disableBidirectionalTransformation: true }, scene);
			ground.checkCollisions = true;

			//setting camera for scene
			setSceneCamera(scene);


			
			resolve(scene);
		};

		assetsManager.onError = function (err) 
		{
			reject(err);
		}
	});
}