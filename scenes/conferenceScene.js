let createConferenceScene = function() 
{
	let scene = new BABYLON.Scene(engine);
	
	// camera
	//let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 4.5), scene);
	let camera = new BABYLON.ArcRotateCamera("Camera", -0.88, 1.14, 18, new BABYLON.Vector3(0, 0, 5), scene); 
	//camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, true);

	let light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);
	let assetsManager = new BABYLON.AssetsManager(scene);

	let myMesh = [];
	//loadEntitiy definition in js/script.js
	LoadEntity("conference", "", "./assets/models/room_conference/", "conferenceScene.glb", assetsManager, myMesh);
	
	assetsManager.load();

	let ground;
	let start = function () {
		//room scaling and positioning
		let walls = scene.getNodeByName("walls");
		let sky = scene.getNodeByName("sky");
		if (walls)
		{			
			walls.setEnabled(false);
		}
		if (sky)
		{			
			sky.setEnabled(false);
		}
		if(scene.getNodeByName("ground"))
		{
			ground = scene.getNodeByName("ground");
		}	
	};
	scene.floorMeshes = myMesh;
	scene.camera = camera;
	assetsManager.onFinish = function (tasks) 
	{
		start();
	};		

	return scene;
}

/*
	positions
	[x= 0, z = -2]
	[x= -5, z = 0]
	[x= 0, z = 2]
	[x= 5, z = 0]
*/