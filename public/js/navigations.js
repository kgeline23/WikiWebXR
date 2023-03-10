
import "https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js";

export const teleportationPatterns = (xr, scene) => 
{
  if(scene.navigation)
  {  
    const featuresManager = xr.baseExperience.featuresManager;
    featuresManager.disableFeature(BABYLON.WebXRFeatureName.MOVEMENT);
 
    featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, 
    {
        xrInput: xr.input,
        floorMeshes: scene.floorMeshes,
        //useMainComponentOnly: true,
        defaultTargetMeshOptions: 
        {
          teleportationFillColor: "#55FF99",
          teleportationBorderColor: "blue"
        }
    });    
  }
}

export const hotspotPattern = (xr, scene) =>
{
  if (scene.hotspots != null && typeof scene.hotspots == typeof [] && scene.hotspots.length > 0) 
  {
    const featuresManager = xr.baseExperience.featuresManager; 
    featuresManager.disableFeature(BABYLON.WebXRFeatureName.MOVEMENT);
    const move = featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable", {
      xrInput: xr.input,
      floorMeshes: scene.floorMeshes,      
      snapToPositionRadius: 1.2,
      snapPointsOnly: true
    });
    const hotspots = scene.hotspots;
    for(let h = 0; h < hotspots.length; h++) 
    {
      move.addSnapPoint(new BABYLON.Vector3(hotspots[h][0], hotspots[h][1], hotspots[h][2]));
    }
  }
}

const speed = 0.1;

function setupCameraForCollisions(camera) 
{
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
}

export const locomotionPattern = (xr, scene) =>
{
  if(scene.navigation)
  {  
    setupCameraForCollisions(xr.input.xrCamera);

    const featuresManager = xr.baseExperience.featuresManager;
    featuresManager.disableFeature(BABYLON.WebXRFeatureName.TELEPORTATION);
    
    const triangle = BABYLON.Mesh.CreateCylinder('triangle', 1, 1, 1, 3, 4, scene);
    const triangleMaterial = new BABYLON.StandardMaterial('triangle-mat', scene);
    triangleMaterial.emissiveColor = BABYLON.Color3.Red();
    triangleMaterial.specularColor = BABYLON.Color3.Black();
    triangle.material = triangleMaterial;
    triangle.isVisible = false;

    const movementFeature = featuresManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, 'latest', {
      xrInput: xr.input,
      // add options here
      movementOrientationFollowsViewerPose: true, // default true
      movementSpeed: speed,
      rotationSpeed: 0.5
    });

    xr.baseExperience.onStateChangedObservable.add((webXRState) => {
      switch(webXRState) 
      {
          case BABYLON.WebXRState.ENTERING_XR:
          case BABYLON.WebXRState.IN_XR:
              triangle.isVisible = false; //can be changed to true to see directional triangle in XR mode
              break;
          default:
              triangle.isVisible = false;
              break;
      }
    });
  
    xr.baseExperience.sessionManager.onXRFrameObservable.add(() => {
        if (xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
          if (movementFeature.movementDirection !== null) {
            triangle.rotation.y = (0.5 + movementFeature.movementDirection.toEulerAngles().y);
            triangle.position.set(xr.input.xrCamera.position.x, 0.5, xr.input.xrCamera.position.z);
          }
        }
    });
    
  }
}



