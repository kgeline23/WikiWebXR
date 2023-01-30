import { LoadEntity } from "../js/scripts.js";

export const createConferenceScene = async function(engine, canvas) 
{
	return new Promise((resolve, reject) => {

		let scene = new BABYLON.Scene(engine);	
		// camera
		const camera = new BABYLON.ArcRotateCamera("Camera", -0.88, 1.14, 18, new BABYLON.Vector3(0, 0, 5), scene);
		camera.attachControl(canvas, true);
		scene.navigation = true; //this will differentiate between free moving or stationary scenes for navigation

		const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);
		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh = [];
		//loadEntitiy definition in js/script.js
		LoadEntity("conference", "", "./assets/models/room_conference/", "conferenceScene.glb", assetsManager, myMesh);
		
		assetsManager.load();
		assetsManager.onFinish = function (tasks) 
		{
			//room scaling 		
			let room = scene.getNodeByName("room");
			room.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);

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
			const ground = scene.getNodeByName("ground");
			if (ground)
			{	
				scene.floorMeshes = [ground];
			}
			else console.log("no ground found");

			//hotspot positions
			scene.hotspots = 		
			[
				[0 , 0, -2],
				[-5, 0, 0 ],
				[0 , 0, 2 ],
				[5 , 0, 0 ]
			];;				
			
			resolve(scene);

		};		

		assetsManager.onError = function (err) {
			reject(err);
		}
	});
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