export const teleportationPatterns = (xr, floorMeshes) => 
{
  const featuresManager = xr.baseExperience.featuresManager; 
    featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, {
        xrInput: xr.input,
        floorMeshes: floorMeshes,
        //useMainComponentOnly: true,
        defaultTargetMeshOptions: 
        {
          teleportationFillColor: "#55FF99",
          teleportationBorderColor: "blue"
        }
    });
}

export const hotspotPattern = (xr, scene) =>
{
  const featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
  const move = featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable", {
    xrInput: xr.input,
    floorMeshes: scene.floorMeshes,      
    snapToPositionRadius: 1.2,
    snapPointsOnly: true
  });
  const hotspots = scene.hotspots;
  for(h = 0; h < hotspots.length; h++) 
  {
    move.addSnapPoint(new BABYLON.Vector3(hotspots[h][0], hotspots[h][1], hotspots[h][2]));
  }
}

export const locomotionPattern = (xr) =>
{

  //const cameraImposter = camera.getPhysicsImposter();

  const swappedHandednessConfiguration = 
  [ //z-axis is height should stay constantwhen moving on a flat surface
    {
      allowedComponentTypes: [BABYLON.WebXRControllerComponent.THUMBSTICK_TYPE, BABYLON.WebXRControllerComponent.TOUCHPAD_TYPE],
      forceHandedness: "left",
      axisChangedHandler: (axes, movementState, featureContext, xrInput) => 
      {
        movementState.rotateX = Math.abs(axes.x) > featureContext.rotationThreshold ? axes.x : 0;
        movementState.rotateY = Math.abs(axes.y) > featureContext.rotationThreshold ? axes.y : 0;
      },
    },
    {
      //for horizontal movement
      allowedComponentTypes: [BABYLON.WebXRControllerComponent.THUMBSTICK_TYPE, BABYLON.WebXRControllerComponent.TOUCHPAD_TYPE],
      forceHandedness: "right",
      axisChangedHandler: (axes, movementState, featureContext, xrInput) => 
      {
        movementState.moveX = (Math.abs(axes.x) > featureContext.movementThreshold) ? axes.x : 0;
        movementState.moveY = Math.abs(axes.y) > featureContext.movementThreshold ? axes.y : 0;
      },
    }
  ];

  const featureManager = xr.baseExperience.featuresManager;
  featureManager.disableFeature(BABYLON.WebXRFeatureName.TELEPORTATION);
    featureManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, "latest", 
  {
    xrInput: xr.input,
    customRegistrationConfigurations: swappedHandednessConfiguration,
  });
}










