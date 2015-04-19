/**
* CLASS TILE
*/
function Tile(type,x,y,dx,dy)
{
	// Default type is water
	this.type = type;
	// Coordinates
	this.x = x;
	this.y = y;
	// Movement
	this.dx = dx;
	this.dy = dy;
	// Box
	this.box = new Rectangle(this.x,this.y,tile_size,tile_size);
	
	// Texture
	this.tex = null;
	switch(this.type){
		
		case WOO:
			this.tex = tex_block_wood;
			break;
		default:
			this.tex = tex_block_water;
			break;
	}
}


// Prototype : shared by all instances
Tile.prototype = 
{	
	
	// Draw the ship directly on the canvas
	draw: function(canvas)
	{
		canvas.drawImage(this.tex,0,50,100,100,this.x,this.y,tile_size,tile_size+iso_effect_size);
	},	
	
	move: function()
	{
		this.x+=this.dx;
		this.y+=this.dy;
	},
	
}

/**
* CLASS TILE GROUP
*/
function TileGroup(tile_group)
{
	this.x = tile_group.x*tile_size;
	this.y = tile_group.y*tile_size;
	this.dx = tile_group.dx;
	this.dy = tile_group.dy;
	this.width = tile_group.width;
	this.height = tile_group.height;
	this.tiles = new Array();
	
	// Load tile_group
	for(var j = 0 ; j < this.height ; ++j ){
		for(var i = 0 ; i < this.width ; ++i ){
			this.tiles[i+j*this.width] = new Tile(tile_group.tiles[i+j*this.width],this.x+tile_size*i,this.y+tile_size*j,this.dx,this.dy);
		}
	}

}
