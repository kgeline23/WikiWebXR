/*!
* Start Bootstrap - Clean Blog v6.0.8 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/

window.addEventListener('DOMContentLoaded', () => {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    const headerHeight = mainNav.clientHeight;
    window.addEventListener('scroll', function() {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if ( currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove(['is-visible']);
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });
});

//load models used in office, multi office and conference scenes 
export const LoadEntity = function (name, meshNameToLoad, url, file, manager, meshArray, props) 
{
    var meshTask = manager.addMeshTask(name, meshNameToLoad, url, file);

    meshTask.onSuccess = function (task) 
    {
        if (task.loadedMeshes.length > 0) {
            meshArray[name] = task.loadedMeshes;
            meshArray[name].position = BABYLON.Vector3.Zero();
            meshArray[name].checkCollisions = true;
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
    meshTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }
}

export const LoadScene = function(engine, navigation)
{
    let scene = new BABYLON.Scene(engine);
    setPhysics(scene);
    scene.navigation = navigation; //this will differentiate between free moving or stationary scenes for navigation
    const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);	
    
    return scene;
}

export const setPhysics = function(scene)
{
    const gravityVector = new BABYLON.Vector3(0, -9.8, 0);
    const physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
}

export const getHotspots = function(scene)
{
    const spots = scene.getNodeByName("hotspots").getChildMeshes();
    let hotspots = [];
    spots.forEach(element => {
        element.computeWorldMatrix(true);
        const vec = element.getAbsolutePosition();
        hotspots.push([vec.x, 0, vec.z]); //assuming ground is at 0, then hotspots are 0 too
    });	
    return hotspots;
}

export const setSceneCamera = function(scene)
{
    let sceneCamera = scene.getCameraByName("sceneCamera");
    if (sceneCamera) {
        sceneCamera.checkCollisions;
        sceneCamera.applyGravity = true;
        sceneCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
        sceneCamera.inputs.clear();
        sceneCamera.inputs.addMouse();

        scene.switchActiveCamera(sceneCamera, true);
        scene.camera = sceneCamera;
    }
}


