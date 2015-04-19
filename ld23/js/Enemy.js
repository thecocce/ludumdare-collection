function Enemy(level,sprite,x,y,pattern,speed,life,bonus,amplitude,frequence){ 
	this.element = new LevelElement(x,y,sprite,"enemy");
	// Movement vector
	this.movement_pattern = pattern;
	this.speed = speed;
	this.life = life;
	this.bonus = bonus;
	this.counters = {'step':0,'dir':1};
	if(amplitude)
		this.amplitude=amplitude
	else
		this.amplitude=1;
	if(frequence && frequence != 0)
		this.frequence=frequence;
	else
		this.frequence=20;
	// 
	this.level = level;
	this.score = this.speed * this.life;
	this.destroy = false;
}


Enemy.prototype = {
	
	move:function(){
	
		switch(this.movement_pattern){
			
			case"track":
				this.moveTrack();
				break;
			
			case"sinus":
				this.moveSinus();
				break;
			
			default: // Move straigth ahead
				this.moveStraight();
				break;
			
		}
	},
	
	moveStraight:function(speed){ 
		// Speed can be changed on the fly
		if(!speed)
			speed = this.speed;
		this.element.box.x-=speed;
	},
	
	moveTrack:function(){
		
		// If in front of the the hero, track movement
		if(this.level.hero.element.box.x < this.element.box.x){ 
		
			var dx = this.level.hero.element.box.x - this.element.box.x - this.element.box.width/2;
			var dy = this.level.hero.element.box.y - this.element.box.y - this.element.box.height/2;
			var dist = Math.sqrt(dx*dx + dy*dy);
		
			// Compute movement vector if not too close
		
			if(dist > 10){
			
				if(dx != 0 && dy != 0)
					this.element.box.x += this.speed * dx/dist;
				if(dy != 0)
				 	this.element.box.y += this.speed * dy/dist;
			}
		}else // Go straight
			this.moveStraight(this.speed*2);
	},
	
	
	moveSinus:function(){
		
		// Set Y coordinate on the sin() func
		if(Math.abs(this.counters.step<1)){
			this.element.box.y += this.amplitude * Math.sin(this.counters.step);
			this.counters.step+=Math.PI/this.frequence*this.counters.dir;
		}
		else{
			this.counters.dir*=-1;
			this.counters.step+=Math.PI/this.frequence*this.counters.dir;
		}
		// Let the enemy move straight on X
		this.moveStraight();
	},
	
	update:function(){
		
		this.move();
		this.element.update();
		if(this.element.box.isOut() || this.collideWithBullet()){ 
			if(--this.life<=0)
				this.destroy=true;
		}
		
	},
	
	collideWithBullet:function(){
		
		for(id in this.level.elements['bullet']){
			if(this.level.elements['bullet'][id].element.grid_pos == this.element.grid_pos){
				
				if(this.level.elements['bullet'][id].element.box.collideWith(this.element.box)){
					this.level.elements['bullet'][id].destroy=true;
					return true;
				}
			}
		}
		return false;
		
	},
	
	onDestroy:function(){
		
		// If destroyed by bullet
		if(!this.element.box.isOut()){ 
			// Sound
			if(this.hero_touched){
				sound_hurt.play();
				this.level.game.scores.total-=2*this.score;
			}
			else{
				sound_destroy.play();
				this.level.game.scores.total+=this.score;
			}
		}
		
		// Pop bonus ?
		// Debug("I have this for you: " + this.bonus);
		if(this.bonus && !this.element.box.isOut())
			this.level.addElement("bonus",new Bonus(this.level,
							this.element.box.x+this.element.box.width/2,
							this.element.box.y+this.element.box.height/2,
							this.bonus));
	},

	
	draw:function(renderer){
			this.element.draw(renderer);
	},
	
}