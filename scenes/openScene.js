let createOpenScene = async function(engine, canvas) 
{
	return new Promise((resolve, reject) => {

		let scene = new BABYLON.Scene(engine);	
		// camera
		//let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 4.5), scene);
		let camera = new BABYLON.ArcRotateCamera("Camera", -0.88, 1.14, 18, new BABYLON.Vector3(0, 0, 0), scene); 
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
			[-9.04, 0, -7.94],
			[-7.18, 0, 6.5  ],
			[4.73 , 0, 5.56 ],
			[5.66 , 0, -7.7 ]
		];	
	
		assetsManager.onFinish = function (tasks) 
		{
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