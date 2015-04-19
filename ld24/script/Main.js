/**
*	Main.js
*	Test code content.
**/

document.addEventListener("DOMContentLoaded", init, false);

// global scope
var game = null;

function init() {

	Debug("Main > DOMContentLoaded.");
	
	var resources = {
		'tex':[
			//'eye_1.png','eye_2.png','eye_3.png',
			'block_blue.png','block_green.png','block_red.png',
		],
		'sound':[
			'block','switch','bonus','tetris','level',
		],
		'music':[
			'music1','music2','music3','music4',
		],
	}

	game = new Game();
	game.load(resources,onGameLoaded);
}

/** This function is called back by the loader when terminating */
function onGameLoaded() {
	Debug("Main > All game resources loaded, starting game main loop.");
	game.init();
	runGame();
}

/**
* This function is supposed to be called every 16ms (60 PFS) via requestAnimFrame. 
* (see script/Common.js to learn more)
* The game main loop is classicaly composed of the update() and render() functions call.
*/
function runGame() {

	// Main loop
	game.update();
	game.render();
	
	// Display debug log on top
	if(DEBUG)
		game.debugLog();

	// Assure the 60 FPS rate
	requestAnimFrame(runGame);
}