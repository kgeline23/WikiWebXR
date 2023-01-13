const featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, {
  xrInput: xr.input,
  // add options here
  floorMeshes: [ground, secondFloor, thirdFloor],
});

const useNavigationPatterns = (xr, floorMeshes) => {
    const featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
    featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, {
        xrInput: xr.input,
        // add options here
        floorMeshes: [... floorMeshes],
    });
}