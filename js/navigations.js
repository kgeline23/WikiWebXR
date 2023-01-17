  let useNavigationPatterns = (xr, floorMeshes) => {
    // snap points
    let snapPoint = BABYLON.MeshBuilder.CreateBox('snapPoint', { height: 0.01, width: 1, depth: 1 });
    snapPoint.position.x = 4;
    snapPoint.position.z = 3;

    let featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
    xr.teleportation.addSnapPoint(snapPoint);
    featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, {
        xrInput: xr.input,
        // add options here
        floorMeshes: [... floorMeshes],
    });
  }

  let hotspotPattern = (xr, ground) =>
  {
    let interestingSpot = new BABYLON.Vector3(-4, 0, 4);
    let interestingSpot2 = new BABYLON.Vector3(4, 0, 4);
    let featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
    let teleportation = featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
      xrInput: xr.input,
      floorMeshes: [ground],
      snapPositions: [interestingSpot, interestingSpot2],
      snapPointsOnly: true
    });
    teleportation.addSnapPoint(new BABYLON.Vector3(0, 0, 6));
  }










