// Class constructor, independant for each instance 
function Tile(x,y,type)
{
	// Infos
	this.scale = tileSize;
	this.light = 1; // 1 = full-shadow > 0 = no-shadow
	this.type = type;
	this.lighted = false;
	this.tag=false;
   	// Coordinates
	this.gridPosition = {'x':x,'y':y};
	this.absPosition = {'x':x*tileSize,'y':y*tileSize};
	
}


// Prototype : shared by all instances
Tile.prototype = 
{	
	
	// Draw the ship directly on the canvas
	draw: function(canvas)
	{
		// Draw tile texture		
		var shadowNeeded=true;    
		switch(this.type){
						
			// Void tile			
			case 0:	
			break;
			
			// Water
			case W:
			canvas.fillStyle = "rgba(0,0,100,0.5)";    
			canvas.fillRect (this.absPosition.x,this.absPosition.y,this.scale,this.scale);  
			break;
			
			// Pikes
			// . Basic Spikes
			case P:
			canvas.drawImage(texSpike,this.absPosition.x,this.absPosition.y);
			break;
			
			// . Underwater pikes
			case U:
			// SPike
			canvas.drawImage(texSpike,this.absPosition.x,this.absPosition.y);
						
			// Water
			canvas.fillStyle = "rgba(0,0,100,0.5)";    
			canvas.fillRect (this.absPosition.x,this.absPosition.y,this.scale,this.scale);  						
			break;
		
			// CheckPoint
			case S:
			canvas.drawImage(texSave,this.absPosition.x,this.absPosition.y);
			break;
			
			// Fake Wall
			case F:
			// If super view
			if(this.tag){
				canvas.fillStyle = "rgb(28,28,28)";
				canvas.fillRect (this.absPosition.x,this.absPosition.y,this.scale,this.scale);
			}
			else{
				shadowNeeded=false;
				canvas.fillStyle = "rgb(0, 0, 0)";
				canvas.fillRect (this.absPosition.x,this.absPosition.y,this.scale,this.scale);
			}			
			break;								
			
			// PowerUp Light
			case POWERUP_LIGHT:
			canvas.drawImage(texPLight,this.absPosition.x,this.absPosition.y);
			break;
			
			// PowerUp Jump
			case POWERUP_JUMP:
			canvas.drawImage(texPBoots,this.absPosition.x,this.absPosition.y);
			break;
		
			// PowerUp Jump
			case POWERUP_VIEW:
			canvas.drawImage(texPView,this.absPosition.x,this.absPosition.y);
			break;	
			
			// Black square
			case 1:
			shadowNeeded=false;
			canvas.fillStyle = "rgb(0, 0, 0)";
			canvas.fillRect (this.absPosition.x,this.absPosition.y,this.scale,this.scale);
			break;
		
			// Textured tiles 
			case A:
			canvas.drawImage(texBDown,this.absPosition.x,this.absPosition.y);
			break;
			case V:
			canvas.drawImage(texBUp,this.absPosition.x,this.absPosition.y);
			break;
		
			// Books
			case B1:
			canvas.drawImage(texBook,this.absPosition.x,this.absPosition.y);
			break;
			
			// Books
			case B2:
			canvas.drawImage(texBook,this.absPosition.x,this.absPosition.y);
			break;
			// Books
			case B3:
			canvas.drawImage(texBook,this.absPosition.x,this.absPosition.y);
			break;
			// Books
			case B4:
			canvas.drawImage(texBook,this.absPosition.x,this.absPosition.y);
			break;
			// Books
			case B5:
			canvas.drawImage(texBook,this.absPosition.x,this.absPosition.y);
			break;
			// Books
			case B6:
			canvas.drawImage(texBook,this.absPosition.x,this.absPosition.y);
			break;
			// Books
			case B7:
			canvas.drawImage(texBook,this.absPosition.x,this.absPosition.y);
			break;
		
		
		}
		// Draw shadow
		if(shadowNeeded){
			canvas.fillStyle = "rgba(0,0,0, "+this.light+")";    
			canvas.fillRect (this.absPosition.x,this.absPosition.y,this.scale,this.scale);  
		}
	},	
	
	// Indicate that the current tile light was not computed
	resetLight:function()
	{
		this.lighted=false;
	},
	
	// Update the ship position and orientation
	setLight: function(light,superView)
	{
		// Adjust current light factor
		this.light=light;
		this.lighted=true;
		if(superView)this.tag=true;
	},
	
	
}
