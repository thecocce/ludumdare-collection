function Sprite(sprite){
	this.width = sprite.width;
	this.height = sprite.height;
	this.display = {
		'rate_max':sprite.display_rate, 
		'rate_counter':0,
	};
	this.frame = {
		'number':sprite.frame_nb,
		'current':0,
	};
	// TODO POLISH this.anim_type = data.anim_type;
	// this.dx = {'dir':0,'x':0};
	// this.dy = {'dir':0,'y':0};
	this.tex = sprite.tex;
	
}


Sprite.prototype = {
	
	animate: function(){
		
		// Animation frames
		// . Display rate
		if(this.display.rate_counter++ >= this.display.rate_max){
			// Switch to next animation frame
			if(++this.frame.current >= this.frame.number)
				this.frame.current = 0;
			this.display.rate_counter = 0;
		}
		
	},
	
	draw: function(renderer,x,y){
		this.animate();
		// renderer.strokeRect(x,y,this.width,this.height);// HITBOXES 
		renderer.drawImage(this.tex,this.width*this.frame.current,0,this.width,this.height,x,y,this.width,this.height);
	},
	
	
}