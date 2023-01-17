let createOpenScene = function() 
{
	let scene = new BABYLON.Scene(engine);	
	// camera
	//let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 4.5), scene);
	let camera = new BABYLON.ArcRotateCamera("Camera", -0.88, 1.14, 18, new BABYLON.Vector3(0, 0, 5), scene); 
	//camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, true);

	let light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);
	
	let assetsManager = new BABYLON.AssetsManager(scene);

	let start = function () {
		//room scaling and positioning
		let sky = scene.getNodeByName("sky");
		if (sky)
		{			
			sky.setEnabled(false);
		}		
	};
	assetsManager.onFinish = function (tasks) 
	{
		start();
	};		

	let myMesh = [];
	//loadEntitiy definition in js/script.js
	LoadEntity("open", "", "./assets/models//", "testScene.glb", assetsManager, myMesh);
	
	assetsManager.load();

	let defaultXRExperience = scene.createDefaultXRExperienceAsync({
		floorMeshes: [myMesh]
	});
	if (!defaultXRExperience.baseExperience) {
		// no xr support
	} else {
		// all good, ready to go
		useNavigationPatterns(defaultXRExperience, [ground]);	
	}

	return scene;
}