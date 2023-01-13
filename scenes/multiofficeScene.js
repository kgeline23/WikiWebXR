const createMultiOfficeScene = function() 
{
	const scene = new BABYLON.Scene(engine);
	
	// camera
	let camera = new BABYLON.ArcRotateCamera("Camera", -2.9, 0.86, 8, new BABYLON.Vector3(0, 0, 4.5), scene);
	//let camera = new BABYLON.WebVRFreeCamera("Camera", new BABYLON.Vector3(0, 1.6, 0), scene);
	//camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, true);

	let light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);

    let start = function () {
		//room scaling and positioning
		let sky = scene.getNodeByName("sky");
		if (sky)
		{			
			sky.setEnabled(false);
		}
    };
	
	let assetsManager = new BABYLON.AssetsManager(scene);

    assetsManager.onFinish = function (tasks) 
	{
        start();
    };
	
	let myMesh = [];
    //loadEntitiy definition in js/script.js
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