// Entry point
document.addEventListener("DOMContentLoaded", init, false);


/**
 * Init the game session
 **/
function init()
{
	// Hide footer	
	$('#footer').hide(0);	
	
	var game = {};
	
	// Save canvas reference
	game.canvasTag = document.getElementById("game");
	game.canvas = game.canvasTag.getContext("2d");
	game.canvas.width = 512;
	game.canvas.height = 384;
	
	// Coordinates
	game.coordinatesTag = document.getElementById("coordinates");
		
	// Remove error msg
	game.canvasTag.innerHTML = "";
	
	
	// Mouse tracking
	game.mouse = {'x':0,'y':0};
	game.canvasTag.onmousemove = function(e){updateMousePosition(game,e)};
	
	// Keyboard tracking
	game.keyboard = {
		'status':{},
		onKeydown:function(event){
			event.preventDefault();
			this.status[event.keyCode]=true;
		},
		onKeyup:function(event){
			delete this.status[event.keyCode];
		},
	};
	window.addEventListener('keydown', function(event) { game.keyboard.onKeydown(event); }, false);
	window.addEventListener('keyup', function(event) { game.keyboard.onKeyup(event); }, false);
	// default control hack (will disable keyboard scrolling)
	window.addEventListener('keydown',function(event) { event.preventDefault(); },false);
	
	// Game quest variable
	game.quest = {
		'tutorialActivated':true,
		'bookNumber':0,
		'finished':false,
	}
	
	// Game mainLoop
	game.FPS = 60;
	setInterval(function(){run(game)},1000/game.FPS);
	
	// Start game
	game.currentLevel = new Level();
	game.currentLevel.loadLevel(data_levels[startLevel]);
	game.hero = new Hero(startX,startY);
	game.hero.setCurrentLevel(game.currentLevel.id,game.currentLevel.tiles);
	
}


function updateMousePosition(game,e)
{
	game.mouse.x = e.clientX - game.canvasTag.offsetLeft;
	game.mouse.y = e.clientY - game.canvasTag.offsetTop;	
	//DEBUG game.coordinatesTag.innerHTML = '('+game.mouse.x+';'+game.mouse.y+')';
}

/**
 * Game loop
 **/
function run(game)
{
	// Start timer
	var startTime = (new Date()).getMilliseconds();	
	
	// END OF GAME CASES
	// . Game finished
	//DEBUG console.log(game.quest.bookNumber);
	if(game.quest.bookNumber>=7){
		if(!game.quest.finished){
			var t = setTimeout(function(){end(game,t)},3000);
			game.quest.finished=true;
		}
		return;
	}	
	// . Hero dead ?
	if(game.hero.state=="death"){
		game.currentLevel.loadLevel(data_levels[game.hero.checkpoint.level]);
		game.hero.absPosition.x=game.hero.checkpoint.position.x;
		game.hero.absPosition.y=game.hero.checkpoint.position.y;		
		game.hero.setCurrentLevel(game.currentLevel.id,game.currentLevel.tiles);
		game.hero.state = "normal";
	}	
	
	// Update game
	game.hero.move(game.keyboard.status);
	game.quest=game.hero.checkCollideWithSpecialItem(game.quest);
		
	
	
	// Level warp needed ?
	if(game.hero.collideWithWarp()){
		game.currentLevel.loadLevel(data_levels[data_levels[game.currentLevel.id].warp[game.hero.warp.current]]);
		game.hero.setPositionFromWarp();
		game.hero.setCurrentLevel(game.currentLevel.id,game.currentLevel.tiles);
	}
	
	// Update screen if needed
	game.canvas.clearRect(0, 0, game.canvas.width, game.canvas.height);

	// Level light effects
	game.currentLevel.resetLight();	
	if(game.hero.powers.hasLight)
		game.currentLevel.applyLight(game.hero.gridPosition.x*tileSize,game.hero.gridPosition.y*tileSize,game.hero.getLightFactor(),game.hero.powers.hasView);
	for(var i=0; i<game.currentLevel.additionnalLights.length;++i)
		game.currentLevel.applyLight(game.currentLevel.additionnalLights[i][0]*tileSize,game.currentLevel.additionnalLights[i][1]*tileSize,8,false);
	
	// Draw scene
	//DEBUG game.hero.drawBoundingBox(game.canvas);	
	game.hero.draw(game.canvas);
	game.currentLevel.draw(game.canvas);
	game.hero.drawSpecialEffects(game.canvas);
	if(game.hero.isReadingText.state==true)
		displayText(game.hero.isReadingText.content,game.hero.isReadingText.position);
	game.quest = applyGlobalEvents(game.quest,game.currentLevel.id);
	game.hero.isReadingText.state=false;
	
	/*	
	// End of game loop, update FPS counter
	var frameTime = (new Date()).getMilliseconds() - startTime;
	if (frameTime <= 0)
		gameInstance.FPSCounter.innerHTML = gameInstance.FPS;
	else
		gameInstance.FPSCounter.innerHTML = Math.round(1000/frameTime);
	*/
}


// Dirty source code file...
// Global events

function applyGlobalEvents(quest,levelNumber){
    
    // Help 1    
    if(quest.tutorialActivated&&levelNumber==0){
        displayText("Arrow keys or A-D to move in the darkness","bottom");
    }
    
    // Help 2
    if(quest.tutorialActivated&&levelNumber==5){
        displayText("Arrow keys or A-D-W-S to swim. Don't forget to breath...","bottom");    
    }
    
     // Help 3
    if(quest.tutorialActivated&&levelNumber==16){
        displayText("Avoid the red pikes !","top");    
    }
    
    // Title screen
    if(levelNumber==2)
	displayTitle("I Was Here");
    
     // Disable help
    if(quest.tutorialActivated&&levelNumber==22){
        quest.tutorialActivated=false;    
    }
    
    return quest;
}


// End of game
function end(t)
{	
	clearTimeout(t);	

	$('#footer').fadeIn(3000);	
	$('#gameDiv').hide(5000,
		function(){
			$('#gameDiv').html(endingHTML);
			$('#gameDiv').show(4000);
		;}
	);
	
}

