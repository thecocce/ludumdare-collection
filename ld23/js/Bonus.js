// mov_speed
// bul_speed
// bul_nb
// shoot_rate

function Bonus(level,x,y,type){ 
	
	this.level = level;
	var tex = null;
	switch(type){
		case "mov_speed":
			tex = tex_bonus_2;
			break;
		case "bul_speed":
			tex = tex_bonus_1;
			break;
		case "shoot_rate":
			tex = tex_bonus_3;
			break;
		default:
			tex = tex_bonus_4;
		
	}
	this.element = new LevelElement(x,y,
									{
									'width':tex.width,
									'height':tex.height,
									'display_rate':1, 
									'frame_nb':1,
									'tex':tex
									}
									,"bonus");
	this.power = type;
	this.destroy = false;
}


Bonus.prototype = {
	
	move:function(){
		--this.element.box.x;
	},
	
	update:function(){
		
		this.move();
		this.element.update();
		if(this.element.box.isOut()){
			this.destroy=true;
		} 
	},
	
	onDestroy:function(){
		
		if(!this.element.box.isOut()){
			sound_bonus.play();
			this.level.game.scores.total+=10;
		}
	},
	
	draw:function(renderer){
			this.element.draw(renderer);
	},	
}