function Hero(level){
	
	this.element = new LevelElement(32,screen_height/2+32/2,sprite_fly_body,"hero")
	this.hitbox = new Rectangle(this.element.box.x+this.element.box.width/2-5,
								this.element.box.y+this.element.box.height/2-5,
								10,10);
	Debug(this.hitbox);
	this.speed = hero_speed;
	this.shoot_rate = hero_shoot_rate;
	this.bullet_speed = hero_bullet_speed;
	this.bullet_nb = hero_bullet_nb;
	this.bullet_power = hero_bullet_power;
	
	this.reload = 0;
	
	this.level = level;
}


Hero.prototype = {
	
	update: function(keyboard){
		
		// TODO POLISH Diagonals
		var dx = 0;
		var dy = 0;
		
		// Keyboard
		// . Movement
		if(this.element.box.y > 0 && (keyboard[KEY_UP]||keyboard[KEY_UP2])){
			dy=-this.speed;
			
		}
		else if(this.element.box.y < screen_height - this.element.box.height && (keyboard[KEY_DOWN]||keyboard[KEY_DOWN2])){
			dy=this.speed;
		}
		if(this.element.box.x > 0 && (keyboard[KEY_LEFT]||keyboard[KEY_LEFT2])){
			dx=-this.speed;
		}
		else if(this.element.box.x < screen_width - this.element.box.width && (keyboard[KEY_RIGHT]||keyboard[KEY_RIGHT2])){
			dx=this.speed;
		}
		this.element.box.x+=dx;
		this.element.box.y+=dy;
		
		// hitbox
		this.hitbox.x = this.element.box.x;
		this.hitbox.y = this.element.box.y;
		this.hitbox.update();
		
		// . Shooting
		if(keyboard[KEY_FIRE]||keyboard[KEY_FIRE2]){
			// We are allowed to shoot 
			if(this.reload++==0)
				this.shoot();
			else if(this.reload >= this.shoot_rate)
				this.reload=0;
		}
		if(this.reload>0)
			++this.reload;
			
		// Update LevelElement
		this.element.update();
		
		// Check if collide with enemy
		this.collideWithEnemy();
		// Check if collide with bonus
		this.collideWithBonus();
			
	},

	collideWithBonus:function(){
		
		for(id in this.level.elements['bonus']){
			if(this.level.elements['bonus'][id].element.grid_pos == this.element.grid_pos){
				
				if(this.level.elements['bonus'][id].element.box.collideWith(this.element.box)){
					this.bonus(this.level.elements['bonus'][id].power);
					this.level.elements['bonus'][id].destroy=true;
					return true;
				}
			}
		}
		return false;
	},
	
	collideWithEnemy:function(){
		
		for(id in this.level.elements['enemy']){
			if(this.level.elements['enemy'][id].element.grid_pos == this.element.grid_pos){
				
				if(this.level.elements['enemy'][id].element.box.collideWith(this.hitbox)){
					// Detroy enemy
					this.level.elements['enemy'][id].destroy=true;
					this.level.elements['enemy'][id].hero_touched = true;
					// Reset bonus !
					this.resetBonuses();
					return true;
				}
			}
		}
		return false;
	},
	
	bonus:function(type){
		if(type=="mov_speed"&&this.speed<hero_speed_max)
			++this.speed;
		else if(type=="bul_speed"&&this.bullet_speed<hero_bullet_speed_max)
			++this.bullet_speed;
		else if(type=="shoot_rate"&&this.shoot_rate>hero_shoot_rate_max)
			this.shoot_rate-=5;
		else if(type=="bul_nb"&&this.bullet_nb<hero_bullet_nb_max)
			++this.bullet_nb;
		else if(type=="bul_power"&&this.bullet_power<hero_bullet_power_max)
			++this.bullet_power;
	},

	resetBonuses:function(){
		this.speed = hero_speed;
		this.shoot_rate = hero_shoot_rate;
		this.bullet_speed = hero_bullet_speed;
		this.bullet_nb = hero_bullet_nb;
		this.bullet_power = hero_bullet_power;
	},

	shoot:function(){
		
		// Play sound
		sound_shoot.play();
		
		// Shoot bullets
		if(this.bullet_nb==1){
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x+32,this.element.box.y+20,bullet_dir_right,this.bullet_speed,this.bullet_power));
		}
		if(this.bullet_nb>=2){
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x+32,this.element.box.y+25,bullet_dir_right,this.bullet_speed,this.bullet_power));
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x+32,this.element.box.y+15,bullet_dir_right,this.bullet_speed,this.bullet_power));
		}
		if(this.bullet_nb>=3){
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x+32,this.element.box.y+20,bullet_dir_diag_right_top,this.bullet_speed,this.bullet_power));
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x+32,this.element.box.y+20,bullet_dir_diag_right_bottom,this.bullet_speed,this.bullet_power));
		}
		if(this.bullet_nb==4){
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x,this.element.box.y+20,bullet_dir_top,this.bullet_speed,this.bullet_power));
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x,this.element.box.y+20,bullet_dir_bottom,this.bullet_speed,this.bullet_power));
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x,this.element.box.y+20,bullet_dir_left,this.bullet_speed,this.bullet_power));
		}
		if(this.bullet_nb==5){
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x+16,this.element.box.y+20,bullet_dir_top,this.bullet_speed,this.bullet_power));
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x+16,this.element.box.y+20,bullet_dir_bottom,this.bullet_speed,this.bullet_power));
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x,this.element.box.y+15,bullet_dir_left,this.bullet_speed,this.bullet_power));
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x,this.element.box.y+25,bullet_dir_left,this.bullet_speed,this.bullet_power));
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x+16,this.element.box.y+20,bullet_dir_diag_left_top,this.bullet_speed,this.bullet_power));
			this.level.addElement("bullet",new Bullet(this.level,this.element.box.x+16,this.element.box.y+20,bullet_dir_diag_left_bottom,this.bullet_speed,this.bullet_power));
			
		}
	},

	draw: function(renderer){
		// Draw
		this.element.draw(renderer);	
	},
}