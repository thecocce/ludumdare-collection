// Map

// Class constructor, independant for each instance 
function Level(game_ref)
{
	// Infos
	this.game = game_ref;
	this.hero = new Hero(this);
	this.elements = 
	{
		'bullet': [],
		'enemy': [],
		'bonus':[],
	};
	
	// Start background
	this.background = new Background();
	
	this.is_finished = false;
}


// Prototype : shared by all instances
Level.prototype = 
{	
	
	load: function(){
		
		this.wave_manager = new WaveManager(this,level_1);
		// Test area	
	},
	
	
	update: function(keyboard)
	{
		// Query the WaveManager state machine
		if(!this.wave_manager.is_finished){
			// Advance state machine
			this.wave_manager.step();
			
			// If the current wave is finished, we load the next one
			if(this.wave_manager.ready){
				this.wave_manager.loadNext();
			}
			// If ready, we load next enemy
			else if(this.wave_manager.current_wave.ready){
				this.addElement('enemy',this.wave_manager.getEnemy());
				this.wave_manager.current_wave.loadNext();
			}
			
		}
		//else game is finished !
		else{
			this.is_finished = true;
			return;
		}
		
		
		// Hero
		this.hero.update(keyboard);
		
		// Bullets
		for(id in this.elements['bullet']){
			this.elements['bullet'][id].update(); 
			if(this.elements['bullet'][id].destroy){
				this.elements['bullet'].splice(id,1);
			}	
		}
		
		// Enemies
		for(id in this.elements['enemy']){
			if(this.elements['enemy'][id].destroy){
				this.elements['enemy'][id].onDestroy();
				this.elements['enemy'].splice(id,1);
			}
			else
				this.elements['enemy'][id].update(); 
		}
		
		// Bonus
		for(id in this.elements['bonus']){
			if(this.elements['bonus'][id].destroy){
				this.elements['bonus'][id].onDestroy();
				this.elements['bonus'].splice(id,1);
			}
			else
				this.elements['bonus'][id].update(); 
		}
		
		// Background
		this.background.update();
		
	},
	
	// Draw the ship directly on the canvas
	draw: function()
	{
		
		// Draw background
		this.background.draw(this.game.renderer);
		
		// Draw bullets
		for(id in this.elements['bullet']){
			if(this.elements['bullet'][id]){
				if(this.elements['bullet'][id])
					this.elements['bullet'][id].draw(this.game.renderer);
			}
		}
		
		// Draw ennemies
		for(id in this.elements['enemy']){
			if(this.elements['enemy'][id]){
					this.elements['enemy'][id].draw(this.game.renderer);
			}
		}
		
		// Draw bonuses
		for(id in this.elements['bonus']){
			if(this.elements['bonus'][id]){
					this.elements['bonus'][id].draw(this.game.renderer);
			}
		}
		
		// hero
		this.hero.draw(this.game.renderer);
		
	
	},
	
	// Add Element
	addElement: function(type,element)
	{
		var index = this.elements[type].push(element) - 1;
		this.elements[type][index].element.index = index;
	},
	
	
	
}