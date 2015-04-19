function LevelElement(x,y,sprite,type){
	
	// Internal data
	this.box = new Rectangle(x,y,sprite.width,sprite.height);
	this.sprite = new Sprite(sprite);
	
	// Indexation
	this.type = type;
	this.grid_pos = this.box;
	this.index = 0;
}


LevelElement.prototype = {
	
	draw:function(renderer){
		this.sprite.draw(renderer,this.box.x,this.box.y);
	},
	
	update:function(){
		this.box.update();
		this.grid_pos = Math.floor((this.box.y+this.box.height/2)/grid_height)*5
						+ Math.floor((this.box.x+this.box.width/2)/grid_width);
			//Debug(this.grid_pos);
	},
}