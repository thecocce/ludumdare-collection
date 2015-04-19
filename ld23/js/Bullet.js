function Bullet(level,x,y,angle,speed,power){ 
	
	this.level = level;
	
	this.element = new LevelElement(x,y,sprite_bullet_1,"bullet");
	// Movement vector
	this.dx = Math.cos(angle)*speed;
	this.dy = Math.sin(angle)*speed;
	
	this.power = power;
	this.destroy = false;
}


Bullet.prototype = {
	
	move:function(){
	
		this.element.box.x+=this.dx;
		this.element.box.y+=this.dy;
		this.element.update();
	},
	
	update:function(){
		
		this.move();
		this.element.update();
		if(this.element.box.isOut()){
			this.destroy=true;
		} 
	},
	
	/*
	isOut:function(screen){
		if(this.elment.box.x<0 || this.elment.box.y<0 || this.elment.box.x > screen_width || this.elment.box.y > screen_height )
			delete this;
	},
	*/
	
	draw:function(renderer){
			this.element.draw(renderer);
	},
	
}