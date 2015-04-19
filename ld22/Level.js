// Class constructor, independant for each instance 
function Level(levelFile)
{
	// Infos
	this.name = "";
	// Coordinates
	this.position = {'x':0,'y':0};
	// Tiles
	this.tiles = new Array();
	// Misc
	this.additionnalLights=new Array();
}	



// Prototype : shared by all instances
Level.prototype = 
{
	// Draw the ship directly on the canvas
	draw: function(canvas)
	{
		for(var y=0;y<12;++y){
			for(var x=0;x<16;++x)
				this.tiles[x+y*16].draw(canvas);
		}
	},	
	
	// Update the ship position and orientation
	loadLevel: function(levelFile)
	{
		// Reset previous data
		this.tiles = new Array();
		this.additionnalLights=new Array();
		
		// Infos
		this.name = levelFile.name;
		this.id = levelFile.id;
		for(var i=0; i<levelFile.lights.length;++i)
			this.additionnalLights.push(levelFile.lights[i]);
		// Coordinates
		this.position = levelFile.position;
		// Tiles
		for(var y=0;y<12;++y){
			for(var x=0;x<16;++x){
				this.tiles.push(new Tile(x,y,levelFile.tiles[x+y*16]));
			}
		}
	},
	
	resetLight:function(){
		for(var y=0;y<12;++y){
			for(var x=0;x<16;++x){
				this.tiles[x+y*16].resetLight();
			}
		}
	},
	
	
	// Add a light source on the the current level
	applyLight: function(targetX,targetY,lightPower,superView)
	{
		var gridPos={'x':Math.floor(targetX/tileSize),'y':Math.floor(targetY/tileSize)}
		var diffCase=0;
		var lightFactor=0;
		
		for(var y=0;y<12;++y){
			for(var x=0;x<16;++x){				
				diffCase = Math.sqrt(Math.pow(Math.abs(x-gridPos.x),2)+Math.pow(Math.abs(y-gridPos.y),2));
				if(diffCase>=lightPower)
					lightFactor=1;
				else
					lightFactor=1/lightPower*diffCase;
				// If previously lighted
				if(this.tiles[x+y*16].lighted)
					this.tiles[x+y*16].setLight(Math.min(lightFactor,this.tiles[x+y*16].light),superView);
				else	
					this.tiles[x+y*16].setLight(lightFactor,superView);
			}
		}
		
	},
	
	
	
	
}
