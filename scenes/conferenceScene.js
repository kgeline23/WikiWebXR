let createConferenceScene = function() 
{
	let scene = new BABYLON.Scene(engine);
	
	// camera
	//let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 4.5), scene);
	let camera = new BABYLON.ArcRotateCamera("Camera", -0.88, 1.14, 18, new BABYLON.Vector3(0, 0, 5), scene); 
	//camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, true);

	let light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);
	/*
	//creating room/walls	
	let corner = function (x, y) {
		return new BABYLON.Vector3(x, 0, y);
	}
	
	let wall = function(corner) {
		this.corner = corner;
	}
	
	let buildFromPlan = function(walls, ply, height, scene) {
	
		let outerData = [];
		let angle = 0;
		let direction = 0;
		let line = BABYLON.Vector3.Zero();
		walls[1].corner.subtractToRef(walls[0].corner, line);
		let nextLine = BABYLON.Vector3.Zero();
		walls[2].corner.subtractToRef(walls[1].corner, nextLine);
		let nbWalls = walls.length;
		for(let w = 0; w <= nbWalls; w++) {	
			angle = Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));
			direction = BABYLON.Vector3.Cross(nextLine, line).normalize().y;
			lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
			line.normalize();
			outerData[(w + 1) % nbWalls] = walls[(w + 1) % nbWalls].corner.add(lineNormal.scale(ply)).add(line.scale(direction * ply/Math.tan(angle/2)));		
			line = nextLine.clone();		
			walls[(w + 3) % nbWalls].corner.subtractToRef(walls[(w + 2) % nbWalls].corner, nextLine);	
		}
	
		let positions = [];
		let indices = [];
	
		for(let w = 0; w < nbWalls; w++) {
			positions.push(walls[w].corner.x, walls[w].corner.y, walls[w].corner.z);        // inner corners base
		}
	
		for(let w = 0; w < nbWalls; w++) {
			positions.push(outerData[w].x, outerData[w].y, outerData[w].z);                 // outer corners base
		}
	
		for(let w = 0; w <nbWalls; w++) {
			indices.push(w, (w + 1) % nbWalls, nbWalls + (w + 1) % nbWalls, w, nbWalls + (w + 1) % nbWalls, w + nbWalls);       // base indices
		}

		let currentLength = positions.length;                                               // inner and outer top corners
		for(let w = 0; w < currentLength/3; w++) {
			positions.push(positions[3*w]);
			positions.push(height);
			positions.push(positions[3*w + 2]);
		}
	
		currentLength = indices.length;
		for(let i = 0; i <currentLength/3; i++) {
			indices.push(indices[3*i + 2] + 2*nbWalls, indices[3*i + 1] + 2*nbWalls, indices[3*i] + 2*nbWalls );                // top indices
		}
	
		for(let w = 0; w <nbWalls; w++) {
			indices.push(w, w + 2 *nbWalls, (w + 1) % nbWalls + 2*nbWalls, w, (w + 1) % nbWalls + 2*nbWalls, (w + 1) % nbWalls); // inner wall indices
			indices.push((w + 1) % nbWalls + 3*nbWalls, w + 3 *nbWalls, w + nbWalls, (w + 1) % nbWalls + nbWalls, (w + 1) % nbWalls + 3*nbWalls, w + nbWalls); // outer wall indices
		}		
	
		let normals = [];
		let uvs = [];
	
		BABYLON.VertexData.ComputeNormals(positions, indices, normals);
		BABYLON.VertexData._ComputeSides(BABYLON.Mesh.FRONTSIDE, positions, indices, normals, uvs);
	
		
		//Create a custom mesh  
		let customMesh = new BABYLON.Mesh("custom", scene);

		//Create a vertexData object
		let vertexData = new BABYLON.VertexData();

		//Assign positions and indices to vertexData
		vertexData.positions = positions;
		vertexData.indices = indices;
		vertexData.normals = normals;
		vertexData.uvs = uvs;	

		//Apply vertexData to custom mesh
		vertexData.applyToMesh(customMesh);
		
		return customMesh;
		
	}
	
	let baseData = 
	[
		[-10, 0], 
		[10, 0], 
		[10, 12], 
		[4, 12], 
		[4, 18], 
		[-10, 18],
	]
	
	let corners = [];
	for(b = 0; b < baseData.length; b++) 
	{
		corners.push(new corner(baseData[b][0], baseData[b][1]));
	}
	
	let walls = [];
	for(c=0; c<corners.length; c++) {
		walls.push(new wall(corners[c]));
	}
	
	let ply = 0.3;
	let height = 5;
				
	buildFromPlan(walls, ply, height,  scene); //{interiorUV: new BABYLON.Vector4(0.2, 0, 1, 1), exteriorUV: new BABYLON.Vector4(0.2, 0, 1, 1), interior:true},
	
//creating floor
	const floorMat = new BABYLON.StandardMaterial("groundMaterial", scene);
	floorMat.diffuseTexture = new BABYLON.Texture("./assets/textures/carpet.png", scene);
	//floorMat.specularColor = new BABYLON.Color3(0, 0, 0);

	let corners = [];
	let corners2D = [];
	for(b = 0; b < baseData.length; b++)
	{
		corners.push(new corner(baseData[b][0], baseData[b][1]));
		corners2D.push(new BABYLON.Vector2(baseData[b][0], baseData[b][1]));
	}
	
	const fl = new BABYLON.PolygonMeshBuilder("floor", corners2D);
	const floor = fl.build();
	floor.material = floorMat;
	


//Loading assets
	let assetsManager = new BABYLON.AssetsManager(scene);

	let start = function () {
		//couch set scaling and positioning
		let carpet = scene.getNodeByName("878a013490164bce87086334b9c38c24.fbx");
		carpet.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
		carpet.position = new BABYLON.Vector3(-5, -1, 0);

		//conference table scaling and positioning
		let conference = scene.getNodeByName("cfecfb0376154b2e95feccebbb294089.fbx");
		conference.scaling = new BABYLON.Vector3(0.02, 0.02, 0.02);
		conference.position = new BABYLON.Vector3(3, -15, 0);
	};

	assetsManager.onFinish = function (tasks) 
	{
		start();
	};
	
	const LoadEntity = function (name, meshNameToLoad, url, file, manager, meshArray, props) 
	{
		let meshTask = manager.addMeshTask(name, meshNameToLoad, url, file);

		meshTask.onSuccess = function (task) 
		{
			meshArray[name] = task.loadedMeshes;
			meshArray[name].position = BABYLON.Vector3.Zero();
			//console.log(meshTask);
			if (props) 
			{
				if (props.scaling) 
				{
					meshArray[name].scaling.copyFrom(props.scaling);
				}
				if (props.position) 
				{
					meshArray[name].position.copyFrom(props.position);
				}
			}
		}
	}
	
	let myMesh = [];
	
	LoadEntity("conference", "", "./assets/models/conference/", "scene.gltf", assetsManager, myMesh);
	LoadEntity("couch_set", "", "./assets/models/couch_set/", "scene.gltf", assetsManager, myMesh);

	assetsManager.load();
	*/
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
	assetsManager.onFinish = function (tasks) 
	{
		start();
	};		

	return scene;
}