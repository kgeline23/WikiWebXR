import { LoadEntity, CreateScene, getHotspots, setSceneCamera, getMesh } from "../js/scripts.js";
import { createMainMenu, addGizmoBehavior, addColorBehavior, addHorizontalBehavior, create3DPanels } from "../js/interactions.js";

export const createOpenScene = async function(engine, canvas)
{
	return new Promise((resolve, reject) =>
	{
		const nav = true;
		let scene = CreateScene(engine, nav); //CreateScene found in scrips.js //navigation is possible, navigation = true
		console.log(scene.isPhysicsEnabled)
		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh = [];
		LoadEntity("open", "", "./assets/models/", "openScene.glb", assetsManager, myMesh); //loadEntitiy definition in js/script.js
		assetsManager.load();

		assetsManager.onFinish = function (tasks)
		{
			//hotspot positions
			scene.hotspots = getHotspots(scene);

			//get floor/ground needed for navigation
			const ground = getMesh(scene, "ground")
			ground.physicsImpostor = new BABYLON.PhysicsImpostor(
				ground,
				BABYLON.PhysicsImpostor.BoxImpostor,
				{ mass: 0, ignoreParent: true, },
				scene
			);
			if (ground)
				scene.floorMeshes = [ground];

			//const t = BABYLON.Mesh.MergeMeshes([tableTop, tableLegs], true, true, undefined, false, true);
			const table = getMesh(scene, "top", 0, false);
			table.checkCollisions = true;
			
			const counter = getMesh(scene, "counter", 0, false);
			counter.isVisible = false;
			counter.checkCollisions = true;

			//color changing of cube
			const cubeColor = getMesh(scene, "cubeColor", 1, true);
			if(cubeColor)
			{
				const meshMaterial = new BABYLON.StandardMaterial("material", scene);
				meshMaterial.diffuseColor = BABYLON.Color3.Random();
				scene.meshMaterial = meshMaterial;
				cubeColor.material = scene.meshMaterial;
				addColorBehavior(scene, cubeColor);
			};

			//transformation of cube
			const cube = getMesh(scene, "cube", 1, true);
			if (cube)
			{
				const mat = new BABYLON.StandardMaterial("material", scene);
				mat.diffuseColor = BABYLON.Color3.Random();
				cube.material = scene.mat;
				addGizmoBehavior(scene, cube); //transform behavior
			};

			//transformation of cube
			const choco = getMesh(scene, "choco", 1, true);
			if (choco)
			{				
				choco.checkCollisions = true;
				addGizmoBehavior(scene, choco); //transform behavior
			};

			//movement of sphere
			const sphere = getMesh(scene, "sphere", 1, true);
			sphere.checkCollisions = true;
			if (sphere)
			{
				sphere.applyGravity = true;
				addHorizontalBehavior(sphere);
			};

			const posChoco = getMesh(scene, "noteChoco");
			create3DPanels(scene, 
				"Have a snack", 
				"Want a different size? Try adjusting the chocolate bar", 
				posChoco.getAbsolutePosition(), 
				new BABYLON.Vector3(0, 0.5 * Math.PI, 0)); //task 2 window

			const posWelcome = getMesh(scene, "noteWelcome");
			create3DPanels(scene, 
				"Welcome!", 
				"Hi, welcome to this demo. How about a quick snack before your meeting? You can find something on the kitchen counter", 
				posWelcome.getAbsolutePosition(), 
				new BABYLON.Vector3(0, 1.5 * Math.PI, 0)); //task 2 window

			const posCenter = getMesh(scene, "noteCenter");
			create3DPanels(scene, 
				"Transformation", 
				"How about clicking on the second cube and see what happens. You can also dragging the cube of the table?", 
				posCenter.getAbsolutePosition(), 
				new BABYLON.Vector3(0, 1 * Math.PI, 0)); //task 2 window
			create3DPanels(scene, 
				"Transformation", 
				"How about clicking on the second cube and see what happens. You can also dragging the cube of the table?", 
				posCenter.getAbsolutePosition(),  
				new BABYLON.Vector3(0, 1 * Math.PI, 0)); //task 2 window
			create3DPanels(scene, 
				"Transformation", 
				"How about clicking on the second cube and see what happens. You can also dragging the cube of the table?", 
				posCenter.getAbsolutePosition(), 
				new BABYLON.Vector3(0, 1 * Math.PI, 0)); //task 2 window
			create3DPanels(scene, 
				"Transformation", 
				"This can be done by changing the scaling, colour, form, and position of the object. Try changing the scaling and rotation of the first cube.", 
				posCenter.getAbsolutePosition(),  
				new BABYLON.Vector3(0, 1 * Math.PI, 0)); //task 1 window

			//setting camera for scene
			setSceneCamera(scene);

			//menu creation
			scene.menu = scene.getNodeByName("menu");
			scene.menuScale = 0.08;
			createMainMenu(scene); //creates hologram menu for changing scenes and navigation type
			resolve(scene);
		};

		assetsManager.onError = function (err)
		{
			reject(err);
		}
	});
}