/**
*
* Block.js
*
* A block is the smallest unit in the tetris game.
* A piece is composed of one or several blocks.
* When one or more lines of blocks appears, all the blocks in these lines disappear...
* ... and the player's score increases.
*
*/

/** Game-specific consts **/
const BLOCK_NORMAL = 0;
const BLOCK_MUTATE_ADD = 1;
const BLOCK_MUTATE_REM = 2;

/** Block class **/

function Block(x,y)
{
	this.grid_x = x;
	this.grid_y = y;

	this.is_falling = true;

	this.block_type = BLOCK_NORMAL;
	this.is_bonus = false;
	
	//this.sprite_eyes = new Sprite(25,25,game.resource_manager.tex_list['eye_'+Math.floor((Math.random()*3+1))+'.png']);
	this.sprite_square = new Sprite(25,25,game.resource_manager.tex_list['block_blue.png']);
}

Block.prototype = {

	// NB: No update function

	move: function(dx,dy){
		this.grid_x+=dx;
		this.grid_y+=dy;
	},

	render: function(renderer,view){
		
		/*
		if(VISUAL_EFFECTS)
		{
			if(this.sprite_square.scale_factor < 1.1)
					this.sprite_square.scale_factor+=0.01;
				else if(this.sprite_square.scale_factor >= 1.1)
					this.sprite_square.scale_factor=0.9;
		}
		else	this.sprite_square.scale_factor = 1;
		*/

		this.sprite_square.render(renderer,this.grid_x*UNIT_WIDTH+view.x,this.grid_y*UNIT_HEIGHT+view.y);
		//this.sprite_eyes.render(renderer,this.grid_x*UNIT_WIDTH+view.x,this.grid_y*UNIT_HEIGHT+view.y);
	},

	setBlockType:function(block_type){
		this.block_type = block_type;
		if(this.block_type > 0)
			this.is_bonus = true;
		else
			this.is_bonus = false;
		// Set correct texture basic square
		switch(this.block_type){
			case BLOCK_MUTATE_REM:
				this.sprite_square = new Sprite(25,25,game.resource_manager.tex_list['block_red.png']);
				break;
			case BLOCK_MUTATE_ADD:
				this.sprite_square = new Sprite(25,25,game.resource_manager.tex_list['block_green.png']);
				break;
			default:
				this.sprite_square = new Sprite(25,25,game.resource_manager.tex_list['block_blue.png']);
				break;
		}
	},

}