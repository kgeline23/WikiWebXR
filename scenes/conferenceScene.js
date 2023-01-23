let createConferenceScene = async function(engine) 
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

	let start = function () {
		//room scaling 		
		let room = scene.getNodeByName("room");
        room.scaling = new BABYLON.Vector3(2, 2, 2);

		//disable sky and walls in model
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

		//get floor/ground needed for navigation
		if(scene.getNodeByName("ground"))
		{
			scene.floorMeshes = scene.getNodeByName("ground");
		}
		else console.log("no ground found");	

		//hotspot positions
		scene.hotspots = 		
		[
			[0 , 1, -2],
			[-5, 1, 0 ],
			[0 , 1, 2 ],
			[5 , 1, 0 ]
		];;		
	};

	assetsManager.onFinish = function (tasks) 
	{
		start();
		scene.camera = camera;
	};		

	return scene;
}

/*
	hotspot positions
	[x= 0 , z = -2]
	[x= -5, z = 0]
	[x= 0 , z = 2]
	[x= 5 , z = 0]
	let interestingSpot0 = new BABYLON.Vector3(0, 1, -2);
    let interestingSpot1 = new BABYLON.Vector3(-5, 1, 0);
    let interestingSpot2 = new BABYLON.Vector3(0, 1, 2 );
    let interestingSpot3 = new BABYLON.Vector3(5, 1, 0 );
*/