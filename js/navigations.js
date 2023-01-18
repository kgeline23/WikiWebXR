  let useNavigationPatterns = (xr, floorMeshes) => {
    // snap points
    let snapPoint = BABYLON.MeshBuilder.CreateBox('snapPoint', { height: 0.01, width: 1, depth: 1 });
    snapPoint.position.x = 4;
    snapPoint.position.z = 3;

    let featuresManager = xr.baseExperience.featuresManager; 
    xr.teleportation.addSnapPoint(snapPoint);
    featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, {
        xrInput: xr.input,
        // add options here
        floorMeshes: [... floorMeshes],
    });
  }

  let hotspotPattern = (xr, floorMeshes) =>
  {
    let interestingSpot = new BABYLON.Vector3(-4, 0, 4);
    let interestingSpot2 = new BABYLON.Vector3(4, 0, 4);
    let featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
    let teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
      xrInput: xr.input,
      floorMeshes: [floorMeshes],
      snapPositions: [interestingSpot, interestingSpot2],
      snapPointsOnly: true
    });
    teleportation.addSnapPoint(new BABYLON.Vector3(0, 0, 6));
  }

  let locomotionPattern = (xr, floorMeshes) =>
  {
    const swappedHandednessConfiguration = 
    [
      {
        allowedComponentTypes: [BABYLON.WebXRControllerComponent.THUMBSTICK_TYPE, BABYLON.WebXRControllerComponent.TOUCHPAD_TYPE],
        forceHandedness: "right",
        axisChangedHandler: (axes, movementState, featureContext, xrInput) => 
        {
          movementState.rotateX = Math.abs(axes.x) > featureContext.rotationThreshold ? axes.x : 0;
          movementState.rotateY = Math.abs(axes.y) > featureContext.rotationThreshold ? axes.y : 0;
        },
      },
      {
        allowedComponentTypes: [WebXRControllerComponent.THUMBSTICK_TYPE, WebXRControllerComponent.TOUCHPAD_TYPE],
        forceHandedness: "left",
        axisChangedHandler: (axes, movementState, featureContext, xrInput) => 
        {
          movementState.moveX = Math.abs(axes.x) > featureContext.movementThreshold ? axes.x : 0;
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










