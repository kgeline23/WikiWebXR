import { LoadEntity, CreateScene, getHotspots, setSceneCamera, getMesh} from "../js/scripts.js";
import { createMainMenu, rayCasting } from "../js/interactions.js";

export const createConferenceScene = async function(engine, canvas)
{
	return new Promise((resolve, reject) => {
		const nav = true; //navigation is possible, navigation = true
		let scene = CreateScene(engine, nav); //CreateScene found in scrips.js 
		scene.navigation = nav;
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

			//floor wasnt identified as a collider soo a dummy ground was created
			var ground = BABYLON.MeshBuilder.CreateBox("ground", { width: 30, height: 0.2, depth: 30 }, scene);
			ground.position.y = 0;
			ground.isVisible = false;
			ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.8, restitution: 0.5, disableBidirectionalTransformation: true }, scene);
			ground.checkCollisions = true;
			scene.floorMeshes = [ground];

			const table = getMesh(scene, "table", 0);
			//const flask = getMesh(scene, "flask", 1, true); //true to made object pickable
			const cube = getMesh(scene, "cube", 1, true);
			const boxMaterial = new BABYLON.StandardMaterial("material", scene);
			boxMaterial.diffuseColor = BABYLON.Color3.Random();
			cube.material = boxMaterial;
			cube.isPickable = true;
			cube.actionManager = new BABYLON.ActionManager(scene);
			cube.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
				BABYLON.ActionManager.OnPickTrigger,
				function(evt)
				{
					const sourceCube = evt.meshUnderPointer;
					//move cube
					boxMaterial.diffuseColor = BABYLON.Color3.Random();
				}
			));

			//setting camera for scene
			setSceneCamera(scene);

			scene.menu = scene.getNodeByName("menu");
			scene.menuScale = 0.08;
			createMainMenu(scene); //creates hologram menu for changing scenes and navigation type
			resolve(scene);
		};

		assetsManager.onError = function (err) {
			reject(err);
		}
	});
}
