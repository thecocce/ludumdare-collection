// Entry point
document.addEventListener("DOMContentLoaded", init, false);

function init() {
	
	Debug("Game start");
	
	// Create game instance
	var game = new Game();
	
	// External events
	// . Keyboard tracking
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

	// . Mouse tracking
	/*
	game.mouse = {'x':0,'y':0};
	game.canvas_tag.onmousemove = function(e){
		game.mouse.x = e.clientX - game.canvas_tag.offsetLeft;
		game.mouse.y = e.clientY - game.canvas_tag.offsetTop;
	};
	*/

	// default control hack (will disable keyboard scrolling)
	window.addEventListener('keydown',function(event) { event.preventDefault(); },false);
	
	// Auto focus
	window.onload = document.getElementById('game').focus();
	
	// Game mainLoop
	setInterval(function(){Run(game)},1000/game.FPS);
}

function Game(){
	
	// Save canvas reference
	this.surface = document.getElementById("game");
	this.surface.innerHTML = "";
	this.surface.width = screen_width;
	this.surface.height = screen_height;
	this.renderer = this.surface.getContext("2d");
	
	// Screen 
	this.screen = "menu"; 
	this.menu = new Menu(this.renderer);
	//this.menu.choice = MENU_PLAY; //DEBUG skip title screen
	
	// GameData
	this.FPS = game_fps;
	this.current_level = null;
	this.hero = null;
	this.scores = null;

}

Game.prototype =
{
	start: function(){
		// Level loading
		this.current_level = new Level(this);
		this.current_level.load();
		// Hero
		this.hero = new Hero(this);
		// Scores
		this.scores = new Scores();
		// Music
		music_main.play();
	},
	
	draw: function(){
		// Clear screen
		this.renderer.clearRect(0, 0, this.surface.width, this.surface.height);
		// Draw map
		this.current_level.draw();
		// Draw scores
		this.scores.draw(this.renderer);
	},
	
	end: function(){
		this.renderer.drawImage(tex_hero,100,200);
		this.renderer.fillStyle="#000";
		this.renderer.textAlign = "center";
		this.renderer.font = "bold 60px Arial";
		this.renderer.fillText("Congratz!! ", 320, 150);
		
	}
}


function Run(game)
{
	if(game.screen == "game"){
		if(!game.current_level.is_finished){
			// Update
			game.current_level.update(game.keyboard.status);
			// Draw
			game.draw();
		}else{
			game.end();
		}
	}
	else if(game.screen == "menu"){
		
		// Game start request
		if(game.menu.choice == MENU_PLAY){
			game.screen = "game";
			game.start();
			game.menu.destroyAssets();
			return;
		}
		
		// Update
		game.menu.update(game.keyboard.status);
		// Draw
		game.menu.draw(game.renderer);
	}

}