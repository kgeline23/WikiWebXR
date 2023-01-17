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
		//table scaling and positioning
		let table = scene.getNodeByName("table");
        table.scaling = new BABYLON.Vector3(0.003, 0.003, 0.003);
		table.position = new BABYLON.Vector3(37, 0, 2);

        //kitchen scaling and positioning
		let kitchen = scene.getNodeByName("kitchen");
        kitchen.scaling = new BABYLON.Vector3(0.002, 0.002, 0.002);
        kitchen.position = new BABYLON.Vector3(10, 0, 10);
		
		//couch_set scaling and positioning
		let couch_set = scene.getNodeByName("couch_set");
        couch_set.scaling = new BABYLON.Vector3(1.25, 1.25, 1.25);
		couch_set.position = new BABYLON.Vector3(-8, 0, -10);	
	};
	let ground;
	assetsManager.onFinish = function (tasks) 
	{
		start();		
		if (scene.getNodeByName("ground"))
		{			
			ground = ground;
		}
		else console.log("no ground found");
	};		

	let myMesh = [];
	//loadEntitiy definition in js/script.js
	LoadEntity("open", "", "./assets/models/", "openScene.glb", assetsManager, myMesh);
	
	assetsManager.load();

	let defaultXRExperience = scene.createDefaultXRExperienceAsync({
		floorMeshes: [myMesh]
	});
	if (!defaultXRExperience.baseExperience) {
		// no xr support
	} else {
		// all good, ready to go
		//useNavigationPatterns(defaultXRExperience, [ground]);
		hotspotPattern(defaultXRExperience, ground);
	}

	return scene;
}