const teleportationPatterns = (xr, floorMeshes) => {

    const featuresManager = xr.baseExperience.featuresManager; 
    featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, {
        xrInput: xr.input,
        floorMeshes: [floorMeshes],
        //useMainComponentOnly: true,
        defaultTargetMeshOptions: 
        {
          teleportationFillColor: "#55FF99",
          teleportationBorderColor: "blue",
        },
    });
  }

  const hotspotPattern = (xr, scene) =>
  {
    const featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
    const move = featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable", {
      xrInput: xr.input,
      floorMeshes: [scene.floorMeshes],      
      snapToPositionRadius: 1.2,
      snapPointsOnly: true,
      defaultTargetMeshOptions: 
      {
        teleportationFillColor: "#55FF99",
        teleportationBorderColor: "blue",
      },
    });
    const hotspots = scene.hotspots;
    for(h = 0; h < hotspots.length; h++) 
    {
      move.addSnapPoint(new BABYLON.Vector3(hotspots[h][0], hotspots[h][1], hotspots[h][2]));
      //console.log(hotspots[h][0] + ", " + hotspots[h][1] + ", " +  hotspots[h][2]);
    }
  }
  /*
	conference positions
	[x= 0, z = -2]
	[x= -5, z = 0]
	[x= 0, z = 2]
	[x= 5, z = 0]
    let interestingSpot0 = new BABYLON.Vector3(0, 1, -2);
    let interestingSpot1 = new BABYLON.Vector3(-5, 1, 0);
    let interestingSpot2 = new BABYLON.Vector3(0, 1, 2);
    let interestingSpot3 = new BABYLON.Vector3(5, 1, 0);
*/

  /*
	open positions
	[x= 6.48 , z = 7.94 ]
	[x= 5.35 , z = -4.52]
	[x= -6.45, z = -3.26]
	[x= -6.7 , z = 7.7  ]
  
		const interestingSpot0 = new BABYLON.Vector3(6.48 , 1, 7.94 );
		const interestingSpot1 = new BABYLON.Vector3(5.35 , 1, -4.52);
		const interestingSpot2 = new BABYLON.Vector3(-6.45, 1, -3.26);
		const interestingSpot3 = new BABYLON.Vector3(-6.7 , 1, 7.7  );
*/

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
        allowedComponentTypes: [BABYLON.WebXRControllerComponent.THUMBSTICK_TYPE, WebXRControllerComponent.TOUCHPAD_TYPE],
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










