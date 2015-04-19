/**
* Game.js
**/

function Game() {

	var self = this;

	// Save canvas reference
	this.surface = document.getElementById("game");
	this.surface.innerHTML = "";
	this.surface.width = SCREEN_WIDTH;
	this.surface.height = SCREEN_HEIGHT;
	this.renderer = this.surface.getContext("2d");

	// Resources
	this.resource_manager = new ResourceManager;

	// Game current state
	this.is_running = false;
	this.current_level = null;

	// External events
	// . Keyboard tracking
	this.keyboard = {
		'status':{},
		onKeydown:function(event){
			event.preventDefault();
			this.status[event.keyCode]=true;
		},
		onKeyup:function(event){
			delete this.status[event.keyCode];
		},
	};
	window.addEventListener('keydown', function(event) { self.keyboard.onKeydown(event); }, false);
	window.addEventListener('keyup', function(event) { self.keyboard.onKeyup(event); }, false);

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
	

	// Debug
	this.frame_count = 0;
	this.last_computed_FPS_time = E_TimeNow() - 1000;
	this.realtime_FPS = 0;
}

Game.prototype = {

	load: function(file_list,callback_function){
		// Load once
		if(!this.resource_manager.ready)
			this.resource_manager.loadFiles(file_list,callback_function);
	},

	init: function() {
		this.is_running = true;
		// Initial default Level
		this.current_level = new Level(this);
	},

	update: function(){

		// Restart
		if(this.keyboard.status[KEY_RESTART])
			this.current_level = new Level(this);

		// Gameover?
		if(this.current_level.is_finished)
			return;

		// Do stuff...
		this.current_level.update(this.keyboard.status);
	},


	render: function() {

		// Gameover?
		if(this.current_level.is_finished)
			return;

		// Clean screen
		this.renderer.clearRect(0, 0, this.surface.width, this.surface.height);

		// Do stuff...
		this.current_level.render(); 
	},

	debugLog: function() {

		// FrameCount
		this.frame_count++;
		var current_time = E_TimeNow();
		if( current_time - this.last_computed_FPS_time >= 1000){
			this.last_computed_FPS_time = current_time;
			this.realtime_FPS = this.frame_count;
			this.frame_count = 0;
		}

	},

}