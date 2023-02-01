
import "https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js";

export const teleportationPatterns = (xr, scene) => 
{
  if(scene.navigation)
  {  
    const featuresManager = xr.baseExperience.featuresManager; 
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
  if (scene.hotspots != null && typeof scene.hotspots == typeof [] && scene.hotspots.length > 0) {
    const featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
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

export const locomotionPattern = (xr, scene) =>
{
  if(scene.navigation)
  {  
    const featureManager = xr.baseExperience.featuresManager;
    featureManager.disableFeature(BABYLON.WebXRFeatureName.TELEPORTATION);
    xr.input.onControllerAddedObservable.add((inputSource) => 
    {
      inputSource.onMotionControllerInitObservable.add((motionController) => 
      {
        if (motionController.handedness === 'left')
          leftController = motionController;
        else
          rightController = motionController;

        const xr_ids = motionController.getComponentIds();
        for (let i=0; i < xr_ids.length; i++) 
        {
          const el = motionController.getComponent(xr_ids[i]);
          
          switch (el.id) {
            case "button":
              el.onButtonStateChangedObservable.add(() => 
              {

              });
            break;
            case "xr-standard-thumbstick":
              el.onAxisValueChangedObservable.add((axes) => 
              {
                //if thumbstick is moved change camera position that is attached to the avatar
                scene.avatar.position.x += Math.abs(axes.x) > featureContext.movementThreshold ? axes.x : 0;
                scene.avatar.position.y += Math.abs(axes.y) > featureContext.movementThreshold ? axes.y : 0;
              });
            break;
          }
        }
      });
    });
  }
}










