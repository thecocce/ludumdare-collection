/**
* Common.js
**/


/**
* Global flags and consts
**/
// Flags
const DEBUG = false;
const OPTI = false; // Experimental and non-stable stuff (can actually optimize)

const T_TEX = 1;
const T_SOUND = 2;
const T_MUSIC = 4;

// Consts
const SCREEN_WIDTH = 640; // Screen size
const SCREEN_HEIGHT = 500;
const UNIT_WIDTH = 25; // Square block size
const UNIT_HEIGHT = 25;  

const FPS = 60; // Change this value doesn't affect animation speed (see "requestAnimFrame" function below)

const MATH_PI = Math.PI;
const MATH_PI_HALF = MATH_PI/2;
const MATH_TWO_PI = 2*MATH_PI;

const MEDIA_TEX_PATH = "media/textures/";
const MEDIA_SOUND_PATH = "media/sounds/";

const KEY_REPEAT = 4; // keyboard imput is read every KEY_REPEAT frames

const KEY_LEFT= 37;
const KEY_LEFT2 = 65;
const KEY_UP= 38;
const KEY_UP2 = 87;
const KEY_RIGHT= 39;
const KEY_RIGHT2 = 68;
const KEY_DOWN= 40;
const KEY_DOWN2 = 83;
const KEY_SPACE = 32; // space_bar
const KEY_C = 86; // c key
const KEY_PAUSE = 80; // p key
const KEY_RESTART = 82; // r key

const BONUS_1_LINES = 100;
const BONUS_2_LINES = 300;
const BONUS_3_LINES = 800;
const BONUS_4_LINES = 2000;
const BONUS_5_LINES = 10000;



/** DEBUG **/
function Debug(text){
	if(DEBUG)
		console.log(text);
}

/** EXPERIMENTAL **/
function E_TimeNow(){
	//if(OPTI)
		// HTML5 High Resolution Timer : http://updates.html5rocks.com/2012/08/When-milliseconds-are-not-enough-performance-now
	//	return Date.now(); //return window.performance.webkitNow();
	//else
		// Classic Date object (less acurate)
		return new Date().getTime();

}

/** 
* Request Animation Frame function by Paul Irish (@paul_irish). 
* Synchronise animations at 60 FPS using browser specific API.
* Learn more at: http://paulirish.com/2011/requestanimationframe-for-smart-animating/ 
**/
window.requestAnimFrame = 	
			(function()
				{
					return  window.requestAnimationFrame || 
					window.webkitRequestAnimationFrame || 
					window.mozRequestAnimationFrame    || 
					window.oRequestAnimationFrame      || 
					window.msRequestAnimationFrame     || 
					function(/* function */ callback, /* DOMElement */ element)
					{
						window.setTimeout(callback, 1000 / 60);
					};
				}
			)();

/**
* C-style sleep function.
* For test purpose.
**/
function sleep(millis) 
{
	var date = new Date();
	var curDate = null;
	do { curDate = new Date(); } 
	while(curDate-date < millis);
} 