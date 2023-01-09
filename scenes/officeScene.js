var createOfficeScene = function() 
{

	
	var scene = new BABYLON.Scene(engine);
	
	// camera
	//var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 4.5), scene);
	var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, 0, 25, new BABYLON.Vector3(0, -5, 5), scene); 
	//var camera = new BABYLON.WebVRFreeCamera("Camera", new BABYLON.Vector3(0, 1.6, 0), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, true);
	var defaultXRExperience = scene.createDefaultXRExperienceAsync({
		uiOptions: {
			sessionMode: 'immersive-ar'
		}
	});
	if (!defaultXRExperience.baseExperience) {
		// no xr support
	} else {
		// all good, ready to go
	}

	var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);
/*	
	var buildFromPlan = function(walls, ply, height, scene) 
	{
		var outerData = [];
		var angle = 0;
		var direction = 0;
		var line = BABYLON.Vector3.Zero();
		walls[1].subtractToRef(walls[0], line);
		var nextLine = BABYLON.Vector3.Zero();
		walls[2].subtractToRef(walls[1], nextLine);
		var nbWalls = walls.length;
		for(var w = 0; w <= nbWalls; w++) {	
			angle = Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));
			direction = BABYLON.Vector3.Cross(nextLine, line).normalize().y;
			lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
			line.normalize();
			outerData[(w + 1) % nbWalls] = walls[(w + 1) % nbWalls].add(lineNormal.scale(ply)).add(line.scale(direction * ply/Math.tan(angle/2)));		
			line = nextLine.clone();		
			walls[(w + 3) % nbWalls].subtractToRef(walls[(w + 2) % nbWalls], nextLine);	
		}
	
		var positions = [];
		var indices = [];
	
		for(var w = 0; w < nbWalls; w++) {
			positions.push(walls[w].x, walls[w].y, walls[w].z); // inner corners base
		}
	
		for(var w = 0; w < nbWalls; w++) {
			positions.push(outerData[w].x, outerData[w].y, outerData[w].z); // outer corners base
		}
	
		for(var w = 0; w <nbWalls; w++) {
			indices.push(w, (w + 1) % nbWalls, nbWalls + (w + 1) % nbWalls, w, nbWalls + (w + 1) % nbWalls, w + nbWalls); // base indices
		}

		var currentLength = positions.length;  // inner and outer top corners
		for(var w = 0; w < currentLength/3; w++) {
			positions.push(positions[3*w]);
			positions.push(height);
			positions.push(positions[3*w + 2]);
		}
	
		currentLength = indices.length;
		for(var i = 0; i <currentLength/3; i++) {
			indices.push(indices[3*i + 2] + 2*nbWalls, indices[3*i + 1] + 2*nbWalls, indices[3*i] + 2*nbWalls ); // top indices
		}
	
		for(var w = 0; w <nbWalls; w++) {
			indices.push(w, w + 2 *nbWalls, (w + 1) % nbWalls + 2*nbWalls, w, (w + 1) % nbWalls + 2*nbWalls, (w + 1) % nbWalls); // inner wall indices
			indices.push((w + 1) % nbWalls + 3*nbWalls, w + 3 *nbWalls, w + nbWalls, (w + 1) % nbWalls + nbWalls, (w + 1) % nbWalls + 3*nbWalls, w + nbWalls); // outer wall indices
		}		
	
		var normals = [];
		var uvs = [];
	
		BABYLON.VertexData.ComputeNormals(positions, indices, normals);
		BABYLON.VertexData._ComputeSides(BABYLON.Mesh.FRONTSIDE, positions, indices, normals, uvs);
	
		
		//Create a custom mesh  
		var customMesh = new BABYLON.Mesh("custom", scene);

		//Create a vertexData object
		var vertexData = new BABYLON.VertexData();

		//Assign positions and indices to vertexData
		vertexData.positions = positions;
		vertexData.indices = indices;
		vertexData.normals = normals;
		vertexData.uvs = uvs;	

		//Apply vertexData to custom mesh
		vertexData.applyToMesh(customMesh);
		return customMesh;
	}
	
	var baseData = 
	[
		[-5, -4], 
		[5, -4], 
		[5, 4], 
		[-5, 4]
	];
	
	var corners = [];
	for(b = 0; b < baseData.length; b++) 
	{
		corners.push(new BABYLON.Vector3(baseData[b][0], 0, baseData[b][1]));
	}
	
	var walls = [];
	for(c=0; c<corners.length; c++) 
	{
		walls.push(corners[c]);
	}
	
	var ply = 0.1;
	var height = 5;

	//create a room layout / walls            
	buildFromPlan(walls, ply, height, scene)
	
	//create the floor
	var floor = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 8}, scene);
	floor.position = new BABYLON.Vector3(0, 0.01, 0);
	const floorMat = new BABYLON.StandardMaterial("groundMat", sceneOffice);
	floorMat.diffuseTexture = new BABYLON.Texture("./assets/textures/carpet.png", sceneOffice);
	//floorMat.specularColor = new BABYLON.Color3(0, 0, 0);
	floor.material = floorMat; 

	var assetsManager = new BABYLON.AssetsManager(scene);

    assetsManager.onFinish = function (tasks) 
	{
        start();
    };
	
	const LoadEntity = function (name, meshNameToLoad, url, file, manager, meshArray, props) 
	{
        var meshTask = manager.addMeshTask(name, meshNameToLoad, url, file);

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
	
	var myMesh = [];

	//LoadEntity("skull", "test", "scenes/", "skull.babylon", assetsManager, myMesh, 1);
    LoadEntity("chair", "", "./assets/models/chair/", "scene.gltf", assetsManager, myMesh);
    LoadEntity("desk", "", "./assets/models/desk/", "scene.gltf", assetsManager, myMesh);
	LoadEntity("bookshelf", "", "./assets/models/bookshelf/", "scene.gltf", assetsManager, myMesh);
	
    assetsManager.load();

    var start = function () {
        //chair scaling and positioning
		var chair = scene.getNodeByName("Chair.obj.cleaner.materialmerger.gles");
        chair.scaling = new BABYLON.Vector3(0.13, 0.13, 0.13);
		chair.position = new BABYLON.Vector3(-2, -1.2, 0.7);

        //desk scaling and positioning
		var desk = scene.getNodeByName("50a2fa0af02547dfbe87cc1b2d43bcf1.fbx");
        desk.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);
        desk.position = new BABYLON.Vector3(-4.2, 0, 0);
		
		//bookshelf scaling and positioning
		var bookshelf = scene.getNodeByName("GLTF_SceneRootNode");
        bookshelf.scaling = new BABYLON.Vector3(4.5, 4.5, 4.5);
		bookshelf.position = new BABYLON.Vector3(-35.7, 1, 0);
    };
	*/
	
	var assetsManager = new BABYLON.AssetsManager(scene);

    assetsManager.onFinish = function (tasks) 
	{
        start();
    };
	
	const LoadEntity = function (name, meshNameToLoad, url, file, manager, meshArray, props) 
	{
        var meshTask = manager.addMeshTask(name, meshNameToLoad, url, file);

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
	LoadEntity("office", "", "./assets/models/room_office/", "scene.gltf", assetsManager, myMesh);
	var myMesh = [];
	
    assetsManager.load();

    var start = function () {
		        //room scaling and positioning
				var room = scene.getNodeByName("Collada visual scene group");
				room.scaling = new BABYLON.Vector3(1, 1, 1);
				room.position = new BABYLON.Vector3(0, 0, 0);
    };

	
	return scene;
}