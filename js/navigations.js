  

    // snap points
  let snapPoint = BABYLON.MeshBuilder.CreateBox('snapPoint', { height: 0.01, width: 1, depth: 1 });
  snapPoint.position.x = 4;
  snapPoint.position.z = 3;

  let useNavigationPatterns = (xr, floorMeshes) => {
    let featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
    xr.teleportation.addSnapPoint(snapPoint);
    featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, {
        xrInput: xr.input,
        // add options here
        floorMeshes: [... floorMeshes],
    });
  }






