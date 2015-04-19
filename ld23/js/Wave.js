/** 
* CLASS WAVE
**/
function Wave(level,wave){
	
	this.enemy_list = new Array();
	this.is_finished = false;
	this.current_enemy = null;
	// Extract enemies from current wave
	for(enemy_id in wave){
	
		for( copy_id = 0 ; copy_id < wave[enemy_id].nb ; ++copy_id){
		
			this.enemy_list.push(
			{'en':new Enemy(level,wave[enemy_id].en.sprite,
							wave[enemy_id].en.x,wave[enemy_id].en.y,
							wave[enemy_id].en.pattern,
							wave[enemy_id].en.speed,
							wave[enemy_id].en.life,
							wave[enemy_id].bonus,
							wave[enemy_id].en.amplitude,
							wave[enemy_id].en.frequence),
			'next':{'type':wave[enemy_id].next.type,'t':wave[enemy_id].next.t}
			});
		}
	}
	this.current_enemy = this.enemy_list.splice(0,1)[0];
	this.ready = false;
	
}

Wave.prototype={
	
	step: function(){
	
		// Load next if possible (timer ends or boss killed)
		if(this.current_enemy.next.type=="timer"&&--this.current_enemy.next.t<=0){
			// Debug(this.current_enemy);
			this.ready = true;
		}
		
	},
	
	loadNext:function(){
		
		// Finished ?
		if(this.enemy_list.length==0){
			this.is_finished = true;
			return;
		}
	
		// Load next if possible (timer ends or boss killed)
		this.current_enemy = this.enemy_list.splice(0,1)[0];
		//Debug("wait for: " + this.current_enemy.next.t);
		this.ready = false;
	},
	
	getEnemy:function(){
		return this.current_enemy.en;
	},
}



/** 
* CLASS WAVE_MANAGER // ENNEMYFACTORY
**/

function WaveManager(level,wave_list){
	this.level=level;
	this.wave_list = new Array();
	this.is_finished = false;
	this.ready = false;
	this.wave_number = wave_list.length;
	// Extract each wave
	for(wave in wave_list){
		this.wave_list.push(new Wave(level,wave_list[wave])); 
	}
	this.current_wave = this.wave_list.splice(0,1)[0];
}

WaveManager.prototype = {
	
	step: function(){
		// Advance state machine
		this.current_wave.step();
		if(this.current_wave.is_finished)
			this.ready = true;
	},
	
	loadNext: function(){
		// State machine last step
		if(this.current_wave.is_finished && this.wave_list.length==0){
			this.is_finished=true;
			return;
		}	
		this.current_wave = this.wave_list.splice(0,1)[0];
		this.ready = false;
	},
	
	getEnemy:function(){
		return(this.current_wave.getEnemy());
	},
}