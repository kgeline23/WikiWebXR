  
  // ...
  // needs a reconfigure - re-enable the feature (will discard the old one and create a new one!)
  let teleportation = xrHelper.teleportation;
  teleportation = featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, {
    xrInput: xrHelper.input,
    floorMeshes: [ground],
    renderingGroupId: 1,
  });

    // snap points
  let snapPoint = BABYLON.MeshBuilder.CreateBox('snapPoint', { height: 0.01, width: 1, depth: 1 });
  snapPoint.position.x = 4;
  snapPoint.position.z = 3;

  let useNavigationPatterns = (xr, floorMeshes) => {
    let featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
    xr.teleportation.addSnapPoint(snapPoint.position);
    featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, {
        xrInput: xr.input,
        // add options here
        floorMeshes: [... floorMeshes],
    });
  }




