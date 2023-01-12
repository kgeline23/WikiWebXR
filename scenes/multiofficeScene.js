const createMultiOfficeScene = function() 
{
	const scene = new BABYLON.Scene(engine);
	
	// camera
	let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 4.5), scene);
	//let camera = new BABYLON.ArcRotateCamera("Camera", 1.57, 0.24, 637.24, new BABYLON.Vector3(0, 0, 0), scene); 
	//let camera = new BABYLON.WebVRFreeCamera("Camera", new BABYLON.Vector3(0, 1.6, 0), scene);
	//camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, true);

	let light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);

    let start = function () {
		//room scaling and positioning
		let room = scene.getNodeByName("Collada visual scene group");
		if (room) {
			room.scaling = new BABYLON.Vector3(1, 1, 1);
			room.position = new BABYLON.Vector3(50, 0, 200);
		}
    };
	
	let assetsManager = new BABYLON.AssetsManager(scene);

    assetsManager.onFinish = function (tasks) 
	{
        start();
    };
	
	let myMesh = [];
	LoadEntity("multioffice", "", "./assets/models/room_multioffice/", "multioffice.gltf", assetsManager, myMesh);
	
    assetsManager.load();

	let defaultXRExperience = scene.createDefaultXRExperienceAsync({
		floorMeshes: [myMesh]
	});
	if (!defaultXRExperience.baseExperience) {
		// no xr support
	} else {
		// all good, ready to go
		useNavigationPatterns(defaultXRExperience, [myMesh]);
	}

	
	return scene;
}