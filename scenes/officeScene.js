let createOfficeScene = async function(engine, canvas) 
{	
	let scene = new BABYLON.Scene(engine);	
	// camera
	//let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 4.5), scene);
	let camera = new BABYLON.ArcRotateCamera("Camera", -3.85, 0.72, 325.57, new BABYLON.Vector3(0, 0, 0), scene);
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
		//get floor/ground needed for navigation
		if (scene.getNodeByName("floor"))
		{			
			scene.floorMeshes = scene.getNodeByName("floor");
		}
		else console.log("no ground found");

		//hotspot positions //change this for conference
		let hotspots = 
		[
			[0 , 1, -2],
			[-5, 1, 0 ],
			[0 , 1, 2 ],
			[5 , 1, 0 ]
		];
		scene.hotspots = hotspots;	
    };	

    assetsManager.onFinish = function (tasks) 
	{
        start();
		scene.camera = camera;
    };
	
	let myMesh = [];
	//loadEntitiy definition in js/script.js
	LoadEntity("office", "", "./assets/models/room_office/", "scene.glb", assetsManager, myMesh);
	
    assetsManager.load();

	scene.floorMeshes = myMesh;

	return scene;
}