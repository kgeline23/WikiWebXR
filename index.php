<meta name="viewport" content="width=device-width, initial-scale=1" charset="utf-8">
<html lang="en">
	<head>
		<title> VR Patterns </title>
		<script src = "https://cdn.babylonjs.com/babylon.js"></script>
		<script src = "https://cdn.babylonjs.com/gui/babylon.gui.js"></script>                  <!-- plugin for GUI-->
		<script src = "https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>    <!-- plugin for loading 3D models-->
		<script src = "https://unpkg.com/earcut@2.1.1/dist/earcut.min.js"></script>
		<script src = "scenes/officeScene.js"></script>
		<script src = "scenes/conferenceScene.js"></script>
		<link   rel = "stylesheet" href="https://use.typekit.net/sse0jec.css">
		<style>
			html {
				--bg-color: #eeeeee;
				--bg-second: rgba(0, 0, 0, 0.1);
				--color: #050505;
				--color-highlight: #303030;
			}
			body {
				background: var(--bg-color);
				color: var(--color);
				/*font-family: ff-ginger-pro, sans-serif; */
				font-weight: 300;
				font-style: normal;
				z-index: 0;
				align-content: center;
			}
			body::before {
				background: url(photo-1637325258040-d2f09636ecf6.avif);
				background-size: 100% 100%;
				opacity: 0.4;
				content: "";
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				height: 100vh;
				width: 100vw;
				z-index: 1;
			}
			header, nav, main, footer {
				display: block;
				max-width: 920px;
				margin: 0 auto;
				z-index: 2;
				position: relative;
			}        
			a, a:link {
				color: var(--color);
			}        
			a:visited {
				color: var(--color-highlight);
			}        
			header {
				margin-top: 2em;
			}
			header img {
				width: 100%;
				height: 5em;
			}
			nav {
				background: var(--bg-second);
				padding: 0;
				height: 2.4em;
			}
			nav ul {
				list-style: none;
				margin: 0;
				padding: 0;
			}
			nav li {
				padding: 0;
			}
			nav a {
				float: left;
				text-align: center;
				padding: 0.7em 1.5em;
				display: block;
				margin: 0;
			}
			nav a:hover {
				background-color: #707070;
				color: #ffffff
			}        
			main {
				border-style: solid;
				border-width: 1em 0;
				border-color: rgba(50, 50, 50, 0.2);
				padding: 1em;
				box-sizing: border-box;
				min-height: 20em;
			}        
			footer {
				background: var(--bg-second);
				padding: 1em;
				box-sizing: border-box;
			}
			canvas 
			{
				width: 650; height: 500; background-color: black;
			}
		</style>
	</head>

	<body>		
		<?php
			include(__DIR__ . "/includes/header.php");
		?>
		<main>
			<h1>Interaction and navigation patterns in Metaverse scenario</h1>
			<p> Project introduction</p>
			<p>The goal is to have an overview of exsisting interaction and navigation patterns, with examples to be able to test them with a hands on experience. The application will be a fully immersive wiki, developed for the Meta (Oculus) Quest 2, which is a virtual reality headset developed by Meta (formaly known as Facebook), and it should be easily acessible. The application will work as a demonstration to help with the decision making of relevant patterns and will function as a base application for future projects. </p>

			<h1>Interaction patterns</h1>
			<p>They are the interactions methods that can be used to interact with the virtual environment. For example, different ways of picking up a cube and resizing it. With the help of sensor and controller information, it is possible to try and make the movements as natural as currently possible.</p>
			<h2>Pointing Selection pattern</h2>
			<p>Description of the pattern and its implementations </p>
			<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</p>
			<h2>Hand Selection interaction pattern</h2>
			<p>Description of the pattern and its implementations </p>
			<ul>
				<li>Volume based selection</li>
				<li>Direct hand manipulation</li>
				<li>Proxy manipulation</li>
				<li>Hand pointing pattern</li>
				<li>World in miniature pattern</li>
			</ul> 
			<canvas id = "patternCanvas"></canvas>
			<script type = "text/javascript">
				const canvas = document.getElementById("patternCanvas");    //get the canvas element
				const engine = new BABYLON.Engine(canvas, true);            //generates the babylon 3D engine
				
				var sceneOffice = createOfficeScene();
				var sceneConference = createConferenceScene();

				var clicks = 0;
				var showScene = 0;
				var advancedTexture;

				
				var createGUI = function(scene, showScene)
				{
					switch(showScene)
					{
						case 0:
							advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, sceneOffice); //sceneOffice
							break
						case 1:
							advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, sceneConference);
							break
					}
					var button = BABYLON.GUI.Button.CreateSimpleButton("but", (showScene == 0)? "Office" : "Conference");
					button.width = 0.2;
					button.height = "40px";
					button.color = "white";
					button.background = "grey";
					button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
					advancedTexture.addControl(button);
					button.onPointerDownObservable.add(
						function()
						{
							clicks++; 
						}
					);
					var button = BABYLON.GUI.Button.CreateSimpleButton("butInspect", "Inspector");
					button.width = 0.2;
					button.height = "40px";
					button.color = "white";
					button.background = "gray";
					button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
					advancedTexture.addControl(button);
					button.onPointerDownObservable.add(
						function()
						{
							scene.debugLayer.show(); 
						}
					);
				}

				createGUI(sceneOffice, showScene);

				engine.runRenderLoop(function()
				{
					if(showScene == 0)
					{
						advancedTexture.dispose();
						createGUI(sceneOffice, showScene); //sceneOffice
						sceneOffice.render();
						showScene = clicks % 2;
					}
					else //(showScene != (clicks % 2))
					{ 
						advancedTexture.dispose();
						createGUI(sceneConference, showScene);
						sceneConference.render();
						showScene = clicks % 2;   
					}					
				});

				//--------------------------------------------------------------------------------
				window.addEventListener("resize", function()
				{
					engine.resize();
				})
			</script>
			<br />

			<h1>Navigation patterns</h1>
			<h2>Physical Navigation pattern</h2>
			<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</p>
			<h2>Virtual  Navigation pattern</h2>
			<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</p>
		</main>

		<footer>
			Copyright&copy; 2022 - All rights reserved
		</footer>
	</body>
</html>