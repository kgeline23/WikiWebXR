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
    meshTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }
}

export const LoadScene = function(engine, navigation, capHeight)
{
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics();
    scene.navigation = navigation; //this will differentiate between free moving or stationary scenes for navigation

    const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);	
    //TODO : get users height from headset
    scene.avatar = BABYLON.MeshBuilder.CreateCapsule("avatar", {radius:0.25, height: capHeight}, scene);
    return scene;
}

