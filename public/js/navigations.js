
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


const speed = 0.5;

const gettingController = function (xr, scene)
{
  const featureManager = xr.baseExperience.featuresManager;
  featureManager.disableFeature(BABYLON.WebXRFeatureName.TELEPORTATION);

  const movementThreshold = 0.07;

  document.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === "w" || k === "ArrowUp") {
      scene.camera.position.x += speed;
    }
    else if (k === "s" || k === "ArrowDown") {
      scene.camera.position.x -= speed;
    }
    else if (k === "a" || k === "ArrowLeft") {
      scene.camera.position.z += speed;
    }
    else if (k === "d" || k === "ArrowRight") {
      scene.camera.position.z -= speed;
    }
  });
  
  //TODO: Relative to camera rotation
  //TODO: on every frame instead of value change
  //TODO: Physics collisions (change movement to a force instead of position)
  xr.input.onControllerAddedObservable.add((inputSource) => 
  {
    inputSource.onMotionControllerInitObservable.add((motionController) => 
    {
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
              //when thumbstick is moved change camera position
              scene.camera.position.x += Math.abs(axes.x) > movementThreshold ? axes.x : 0;
              scene.camera.position.z += Math.abs(axes.y) > movementThreshold ? axes.y : 0;

            //   scene.camera.physicsImposter.setVelocity(
            //               mesh.physicsImpostor.getLinearVelocity().add(transformForce(mesh, direction.scale(power))
            // ))


            //   let movementDirection = xr.input.xrCamera.rotationQuaternion.clone();
            //   let tmpRotationMatrix = BABYLON.Matrix.Identity();
            //   let tmpTranslationDirection, tmpMovementTranslation;
            //   movementDirection.copyFrom(xr.input.xrCamera.rotationQuaternion);

            //   BABYLON.Matrix.FromQuaternionToRef(movementDirection, tmpRotationMatrix);
            //   tmpTranslationDirection = new BABYLON.Vector3(axes.x, 0, axes.y * (xr.scene.useRightHandedSystem ? 1.0 : -1.0))
            //   // move according to forward direction based on camera speed
            //   BABYLON.Vector3.TransformCoordinatesToRef(tmpTranslationDirection, tmpRotationMatrix, tmpMovementTranslation);
            //   tmpMovementTranslation.scaleInPlace(xr.input.xrCamera.computeLocalCameraSpeed() * movementThreshold);
  
            //   xr.input.xrCamera.cameraDirection.addInPlace(tmpMovementTranslation);

            });
          break;
        }
      }
    });
  });
}

export const locomotionPattern = (xr, scene) =>
{
  if(scene.navigation)
  {  
    // const featuresManager = xr.baseExperience.featuresManager;
    // featuresManager.disableFeature(BABYLON.WebXRFeatureName.TELEPORTATION);
    
    // const movementFeature = featuresManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, 'latest', {
    //     xrInput: xr.input,
    //     movementOrientationFollowsViewerPose: true, // default true
    //     movementSpeed: 0.2,
    //     rotationSpeed: 0.5
    // });
    gettingController(xr, scene);
  }
}



