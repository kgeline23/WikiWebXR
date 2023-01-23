let createOpenScene = async function(engine, canvas) 
{
	return new Promise((resolve, reject) => {

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
		LoadEntity("open", "", "./assets/models/", "openScene.glb", assetsManager, myMesh);
		
		assetsManager.load();
	
		//hotspot positions
		scene.hotspots = 
		[
			[6.48 , 1, 7.94],
			[5.35 , 1, -4.52],
			[-6.45, 1, -3.26],
			[-6.7 , 1, 7.7  ]
		];	
		console.log("after hotspots");
	
		assetsManager.onFinish = function (tasks) 
		{
			//table scaling and positioning
			console.log("in start");
			/*
			const table = scene.getNodeByName("table");
			if (table) {
				table.scaling = new BABYLON.Vector3(0.0008, 0.0008, 0.0008);
				table.position = new BABYLON.Vector3(2, 0, -3);
			}
			//kitchen scaling and positioning
			const kitchen = scene.getNodeByName("kitchen");
			if (kitchen)
			{	
				kitchen.scaling = new BABYLON.Vector3(0.0007, 0.0007, 0.0007);
				kitchen.position = new BABYLON.Vector3(5, -0.1, 4);
			}
				
			//couch_set scaling and positioning
			const couch_set = scene.getNodeByName("couch_set");
			if (couch_set)
			{
				couch_set.scaling = new BABYLON.Vector3(0.35, 0.35, 0.35);
				couch_set.position = new BABYLON.Vector3(-3, 0, -4.5);
			}	
			//stairs scaling and positioning
			const stairs = scene.getNodeByName("stairs");
			if (stairs)
			{
				stairs.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
			}
*/
			//get floor/ground needed for navigation
			const ground = scene.getNodeByName("ground");
			if (ground)
			{	
				//ground.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
				//ground.position = new BABYLON.Vector3(0, 0, 0);
				scene.floorMeshes = [ground];
			}
			else console.log("no ground found");
			scene.camera = camera;

			resolve(scene);
		};

		assetsManager.onError = function (err) {
			reject(err);
		}
	});
}