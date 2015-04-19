// Class constructor, independant for each instance 
function Hero(x,y)
{
	// Infos
	this.scale = 1;
	this.size = 5;
	this.direction=1;
   	// Coordinates
	this.gridPosition = {'x':x,'y':y};
	this.absPosition = {'x':x*(tileSize+0.5),'y':y*(tileSize+0.5)};
	this.grav = 0;
	// Bounding box
	this.box = {'w':12,'h':16}; // distance from center [<-w->center<-w->]
	// State
	this.state = "normal";
	this.hasMoved = false;
	this.isJumping = false;
	this.autodiving = {'state':'up','timer':10};
	this.oxygen={'max':2500,'current':1};
	this.isReadingText={'state':false,'content':""};
	// Powers
	this.powers = {'hasLight':false,'canJump':false,'hasView':false}
	this.lightHaloDist = 10;	
	// Checkpoint
	this.checkpoint = {'level':0,'position':{'x':0,'y':0}};
	// External references
	this.currentLevelId=0;
	this.currentLevelTiles= null;
	this.warp =
	{
		'current':'none',
		'target':{'level':0,'x':0,'y':0}
	}
}


// Prototype : shared by all instances
Hero.prototype = 
{
	// Draw the hero character directly on the canvas
	draw: function(canvas)
	{
		if(this.direction==1)
			canvas.drawImage(texHeroL,this.absPosition.x-1.4*this.box.w,this.absPosition.y-this.box.h);		
		else
			canvas.drawImage(texHeroR,this.absPosition.x-1.4*this.box.w,this.absPosition.y-this.box.h);		
	},	
	
	// Draw hero's eyes on the top of any shadow effect	
	drawSpecialEffects:function(canvas)
	{
		if((this.state=="swim"||!this.powers.hasLight)&&this.state!="death"){
			if(this.direction==1)
				canvas.drawImage(texHeroEyes,this.absPosition.x+15-2.4*this.box.w,this.absPosition.y+6-this.box.h);
			else
				canvas.drawImage(texHeroEyes,this.absPosition.x+16-1.4*this.box.w,this.absPosition.y+6-this.box.h);		
		}
	},
	
	drawBoundingBox:function(canvas)
	{
		canvas.fillStyle   = '#0f0';		
		canvas.fillRect(this.absPosition.x-this.box.w,this.absPosition.y-this.box.h/2,this.box.w*2,this.box.h*1.5);
		//strokeRect(x,y,width,height);
	},

	setCurrentLevel:function(levelId,levelTiles)
	{
		this.currentLevelId = levelId;		
		this.currentLevelTiles = levelTiles;
	},
	
	setPositionFromWarp:function(warp)
	{
		this.absPosition.x=this.warp.target.x;
		this.absPosition.y=this.warp.target.y;
		this.warp.current='none';
		
	},
	
	
	saveCheckpoint:function()
	{
		this.checkpoint.level=this.currentLevelId;
		this.checkpoint.position.x=this.absPosition.x;
		this.checkpoint.position.y=this.absPosition.y;		
		//DEBUG console.log("saved level "+this.checkpoint.level+" at "+this.checkpoint.position.x+" "+this.checkpoint.position.y); 		
		
	},
	
/*	// Update the ship position and orientation
	update: function()
	{
		this.move();
	},
	
	// Update the polygon points relatively to the x,y coordinates and the rot angle
	updatePoints: function()
	{
		this.b1.x = this.dir.x*this.scale*this.size+this.center.x;
		this.b1.y = this.dir.y*this.scale*this.size+this.center.y;
		this.b2.x = -this.dir.y*this.scale*this.size+this.center.x;
		this.b2.y = this.dir.x*this.scale*this.size+this.center.y;
		this.b3.x = this.dir.y*this.scale*this.size+this.center.x;
		this.b3.y = -this.dir.x*this.scale*this.size+this.center.y;
	},
	
	rotate: function(angle)
	{
		// New direction
		this.angle = angle;
		// Direction vector
		this.dir.x = Math.cos(angle);
		this.dir.y = Math.sin(angle);	
		// Compute points coordinates
		this.updatePoints();
	},
*?
	
	/**
	* Movement
	*/
	move:function(keyboard){
		// Basic movement		
		if(this.state=="normal"){
			this.moveNormal(keyboard);
			if(this.collideWithWater()){
				this.state="swim";
				this.oxygen.current = this.oxygen.max;
			}
		}
		// Swimming
		else if(this.state=="swim"){
			
			// Decrease oxygen
			if(--this.oxygen.current<=0)
				this.state="death";
			
			this.moveSwim(keyboard);
			if(this.getOutOfWater()){
				this.state="normal";
				this.grav=maxJump*2/3;
			}
		}
		// No movement (default)
		else{
			
		}
	},
	
	// Normal movement, walk and jump
	moveNormal: function(keyboard)
	{		
		// X axis movement		
		if((keyboard[KEY_LEFT]||keyboard[KEY_LEFT2])&&!this.collideWithLeftWall()&&!this.collideWithLeftFakeWall()){
			this.absPosition.x-=heroSpeed;
			this.direction=1;
		}
		if((keyboard[KEY_RIGHT]|keyboard[KEY_RIGHT2])&&!this.collideWithRightWall()&&!this.collideWithRightFakeWall()){
			this.absPosition.x+=heroSpeed;
			this.direction=-1;
		}
		// Y axis movement
		if(this.powers.canJump&&(keyboard[KEY_UP]|keyboard[KEY_UP2])&&!this.isJumping){
			this.grav=maxJump;
			this.isJumping=true;
		}		
		
		this.applyGravity();
		this.checkCollideWithCheckpoint();
		
		// Check ennemy collisions		
		if(this.collideWithSpike())
				this.state="death";
	
		// Compute grid coordinates
		this.gridPosition = {'x':Math.floor(this.absPosition.x/tileSize),'y':Math.floor(this.absPosition.y/tileSize)};
	},
	
	// Swimming movement, can go in 8 directions
	moveSwim: function(keyboard)
	{
		// X axis movement		
		if((keyboard[KEY_LEFT]|keyboard[KEY_LEFT2])&&!this.collideWithLeftWall()){
			this.absPosition.x-=heroSpeed;
			this.direction=1;
		}
		if((keyboard[KEY_RIGHT]||keyboard[KEY_RIGHT2])&&!this.collideWithRightWall()){
			this.absPosition.x+=heroSpeed;
			this.direction=-1;
		}
		// Y axis movement		
		if((keyboard[KEY_UP]|keyboard[KEY_UP2])&&!this.collideWithCeiling())
			this.absPosition.y-=heroSpeed;		
		if((keyboard[KEY_DOWN]||keyboard[KEY_DOWN2])&&!this.collideWithFloor())
			this.absPosition.y+=heroSpeed;		
		
		// Random up/down movement
		if(this.autodiving.state=='up' && !this.collideWithCeiling()){
			this.absPosition.y-=0.2;
			if(--this.autodiving.timer==0){
				this.autodiving.state='down';
				this.autodiving.timer=20;
			}
		}
		else if(this.autodiving.state=='down' && !this.collideWithFloor()){
			this.absPosition.y+=0.2;
			if(--this.autodiving.timer==0){
				this.autodiving.state='up';
				this.autodiving.timer=20;
			}
		}
		
		// Check ennemy collisions		
		if(this.collideWithSpike())
				this.state="death";
		
		
		// Compute grid coordinates
		this.gridPosition = {'x':Math.floor(this.absPosition.x/tileSize),'y':Math.floor(this.absPosition.y/tileSize)};
	},
		
	
	applyGravity: function()
	{
		// Hero y axis movement
		this.absPosition.y += this.grav/2;
		// Fall speed limit
		if(this.grav<16)
			this.grav += gravity;
		// If we collide with the floor
		while(this.collideWithFloor()){
			this.absPosition.y -= gravity/2;
			this.grav = 0;
			if(this.isJumping)
				this.isJumping=false;
		}
		// If we collide with the ceiling
		if (this.collideWithCeiling())
			this.grav = 3;
		
	},
	
	collideWithFloor: function()
	{
		// Collide with bottom of screen or an obstacle
		if(this.absPosition.y+this.box.h >= screenSize.h ||
		   this.currentLevelTiles[Math.floor((this.absPosition.x-this.box.w+4)/tileSize)+Math.floor((this.absPosition.y+this.box.h)/tileSize)*16].type>0 ||
		   this.currentLevelTiles[Math.floor((this.absPosition.x+this.box.w-4)/tileSize)+Math.floor((this.absPosition.y+this.box.h)/tileSize)*16].type>0
		   ){	return true;
		}		
		return false;
	},
	
	collideWithCeiling: function()
	{
		// Collide with top of screen or an obstacle
		if(this.absPosition.y-this.box.h <= 0 ||		   
		   this.currentLevelTiles[Math.floor((this.absPosition.x-this.box.w+4)/tileSize)+Math.floor((this.absPosition.y-this.box.h/2)/tileSize)*16].type>0 ||
		   this.currentLevelTiles[Math.floor((this.absPosition.x+this.box.w-4)/tileSize)+Math.floor((this.absPosition.y-this.box.h/2)/tileSize)*16].type>0
		   ){
			return true;
		}		
		return false;
	},	
	
	collideWithLeftWall: function()
	{
		// Collide with left side of the screen or an obstacle
		if(this.absPosition.x-this.box.w <= 0 ||
		   this.currentLevelTiles[Math.floor((this.absPosition.x-this.box.w)/tileSize)+Math.floor((this.absPosition.y-this.box.h/2+4)/tileSize)*16].type>0 ||
		   this.currentLevelTiles[Math.floor((this.absPosition.x-this.box.w)/tileSize)+Math.floor((this.absPosition.y+this.box.h-4)/tileSize)*16].type>0		   
		   ){
			return true;
		}		
		return false;
	},

	
	collideWithRightWall: function()
	{
		// Collide with right side of the screen or an obstacle
		if(this.absPosition.x-this.box.w <= 0 ||
		   this.currentLevelTiles[Math.floor((this.absPosition.x+this.box.w)/tileSize)+Math.floor((this.absPosition.y-this.box.h/2+4)/tileSize)*16].type>0 ||
		   this.currentLevelTiles[Math.floor((this.absPosition.x+this.box.w)/tileSize)+Math.floor((this.absPosition.y+this.box.h-4)/tileSize)*16].type>0		   
		   ){
			return true;
		}		
		return false;
	},
	
	collideWithWater: function()
	{
		// Collide with bottom of screen or an obstacle
		if(this.currentLevelTiles[Math.floor((this.absPosition.x-this.box.w+4)/tileSize)+Math.floor((this.absPosition.y-this.box.h/2)/tileSize)*16].type==-1 ||
		   this.currentLevelTiles[Math.floor((this.absPosition.x+this.box.w-4)/tileSize)+Math.floor((this.absPosition.y-this.box.h/2)/tileSize)*16].type==-1
		   )
			return true;		
		return false;
	},
	
	collideWithLeftFakeWall: function()
	{
		if(this.powers.hasView)
			return false;
		
		// Collide with left side of the screen or an obstacle
		if(this.currentLevelTiles[Math.floor((this.absPosition.x-this.box.w)/tileSize)+Math.floor((this.absPosition.y-this.box.h/2+4)/tileSize)*16].type==F ||
		   this.currentLevelTiles[Math.floor((this.absPosition.x-this.box.w)/tileSize)+Math.floor((this.absPosition.y+this.box.h-4)/tileSize)*16].type==F		   
		   )
		return true;
		else		
		return false;
	},
	
	collideWithRightFakeWall: function()
	{
		if(this.powers.hasView)
			return false;
		
		// Collide with right side of the screen or an obstacle
		if(this.currentLevelTiles[Math.floor((this.absPosition.x+this.box.w)/tileSize)+Math.floor((this.absPosition.y-this.box.h/2+4)/tileSize)*16].type==F ||
			this.currentLevelTiles[Math.floor((this.absPosition.x+this.box.w)/tileSize)+Math.floor((this.absPosition.y+this.box.h-4)/tileSize)*16].type==F		   
		   )
		return true;
		else
		return false;
	},

	// Collide with ennemy
	collideWithSpike:function()
	{
		var point1 = Math.floor((this.absPosition.x-5)/tileSize)+Math.floor((this.absPosition.y)/tileSize)*16;
		var point2 = Math.floor((this.absPosition.x+5)/tileSize)+Math.floor((this.absPosition.y)/tileSize)*16;
		var point3 = Math.floor((this.absPosition.x)/tileSize)+Math.floor((this.absPosition.y+15)/tileSize)*16;
		var point4 = Math.floor((this.absPosition.x)/tileSize)+Math.floor((this.absPosition.y-10)/tileSize)*16;
				
		
		if(
		   (this.currentLevelTiles[point1].type==P ||
		    this.currentLevelTiles[point1].type==U) &&
		   
		   (this.currentLevelTiles[point2].type==P ||
		    this.currentLevelTiles[point2].type==U) &&
		   
		   (this.currentLevelTiles[point3].type==P ||
		    this.currentLevelTiles[point3].type==U) &&
		   
		   (this.currentLevelTiles[point4].type==P ||
		    this.currentLevelTiles[point4].type==U)
		){	return true;
		}		
		return false;
	},
	
	getOutOfWater: function()
	{
		// Collide with bottom of screen or an obstacle
		if(this.currentLevelTiles[Math.floor((this.absPosition.x-this.box.w+4)/tileSize)+Math.floor((this.absPosition.y+this.box.h/2)/tileSize)*16].type==0 ||
		   this.currentLevelTiles[Math.floor((this.absPosition.x+this.box.w-4)/tileSize)+Math.floor((this.absPosition.y+this.box.h/2)/tileSize)*16].type==0
		   )
			return true;		
		return false;
	},
	
	// Returns true if hero is out of the screen or collide with a special warp
	// ... also update the current warp information for an upcoming teleportation
	collideWithWarp:function()
	{		
		// Exit left		
		if(this.absPosition.x <= this.box.w){
			this.warp.current='left';
			this.warp.target.x=screenSize.w-this.box.w-1;
			this.warp.target.y=this.absPosition.y;
			return true;
		}		
		// Exit right		
		if(this.absPosition.x >= screenSize.w-this.box.w){
			this.warp.current='right';
			this.warp.target.x=this.box.w+1;
			this.warp.target.y=this.absPosition.y;
			return true;
		}
		// Exit bottom		
		if(this.absPosition.y >= screenSize.h-2*this.box.h){
			this.warp.current='down';
			this.warp.target.x=this.absPosition.x;
			this.warp.target.y=this.box.h+4;
			return true;
		}
		// Exit top		
		if(this.absPosition.y <= this.box.h){
			this.warp.current='top';
			this.warp.target.x=this.absPosition.x;
			this.warp.target.y=screenSize.h-2*this.box.h-4;
			this.grav=maxJump;
			return true;
		}
		
		
		return false;
	},
	
	checkCollideWithCheckpoint:function()
	{
		if(this.currentLevelTiles[this.gridPosition.x+this.gridPosition.y*16].type==S){
			this.saveCheckpoint();
			this.isReadingText={'state':true,
					    'position':"top",
					    'content':"Game saved"};	
		
		}
	},
	
	// Collect special item
	checkCollideWithSpecialItem:function(quest)
	{
		// Light		
		if(this.currentLevelTiles[this.gridPosition.x+this.gridPosition.y*16].type==POWERUP_LIGHT){
			if(!this.powers.hasLight){
				this.powers.hasLight=true;
				this.saveCheckpoint();
			}
			this.isReadingText={'state':true,
					    'position':"bottom",
					    'content':"You collected the LIGHT! Find your way in the darkness."};	
		}
		
		// Jump		
		if(this.currentLevelTiles[this.gridPosition.x+this.gridPosition.y*16].type==POWERUP_JUMP){
			if(!this.powers.canJump){			
				this.powers.canJump=true;
				this.saveCheckpoint();
			}
			this.isReadingText={'state':true,
					    'position':"bottom",
					    'content':"You collected the BOOTS! Jump with UP - W"};	
		
		}
		
		// Jump		
		if(this.currentLevelTiles[this.gridPosition.x+this.gridPosition.y*16].type==POWERUP_VIEW){
			if(!this.powers.hasView){
				this.powers.hasView=true;
				this.saveCheckpoint();
			}
			this.isReadingText={'state':true,
					    'position':"bottom",
					    'content':"You found the SUPER VIEW! You can cross secret walls..."};	
		
		}
		
		// Books
		// 1		
		if(this.currentLevelTiles[this.gridPosition.x+this.gridPosition.y*16].type==B1){			
			if(!data_quest[0].picked){
				data_quest[0].picked=true;
				++quest.bookNumber;
			}
			this.isReadingText.state=true;
			this.isReadingText.position="bottom";
			this.isReadingText.content=data_quest[0].content;
		}
		// 2		
		if(this.currentLevelTiles[this.gridPosition.x+this.gridPosition.y*16].type==B2){			
			if(!data_quest[1].picked){
				data_quest[1].picked=true;
				++quest.bookNumber;
			}
			this.isReadingText.state=true;
			this.isReadingText.position="bottom";
			this.isReadingText.content=data_quest[1].content;
		}
		// 3		
		if(this.currentLevelTiles[this.gridPosition.x+this.gridPosition.y*16].type==B3){			
			if(!data_quest[2].picked){
				data_quest[2].picked=true;
				++quest.bookNumber;
			}
			this.isReadingText.state=true;
			this.isReadingText.position="bottom";
			this.isReadingText.content=data_quest[2].content;
		}
		
		// 4		
		if(this.currentLevelTiles[this.gridPosition.x+this.gridPosition.y*16].type==B4){			
			if(!data_quest[3].picked){
				data_quest[3].picked=true;
				++quest.bookNumber;
			}
			this.isReadingText.state=true;
			this.isReadingText.position="bottom";
			this.isReadingText.content=data_quest[3].content;
		}
		
		// 5		
		if(this.currentLevelTiles[this.gridPosition.x+this.gridPosition.y*16].type==B5){			
			if(!data_quest[4].picked){
				data_quest[4].picked=true;
				++quest.bookNumber;
			}
			this.isReadingText.state=true;
			this.isReadingText.position="top";
			this.isReadingText.content=data_quest[4].content;
		}
		
		// 6		
		if(this.currentLevelTiles[this.gridPosition.x+this.gridPosition.y*16].type==B6){			
			if(!data_quest[5].picked){
				data_quest[5].picked=true;
				++quest.bookNumber;
			}
			this.isReadingText.state=true;
			this.isReadingText.position="bottom";
			this.isReadingText.content=data_quest[5].content;
		}
		
		// 7		
		if(this.currentLevelTiles[this.gridPosition.x+this.gridPosition.y*16].type==B7){			
			if(!data_quest[6].picked){
				data_quest[6].picked=true;
				++quest.bookNumber;
			}
			this.isReadingText.state=true;
			this.isReadingText.position="bottom";
			this.isReadingText.content=data_quest[6].content;
		}
		return quest;
			
	},
	
	
	// Underwater
	getLightFactor:function()
	{
		if(this.state=="swim")
			return(this.lightHaloDist*(this.oxygen.current-this.oxygen.max/8)/(this.oxygen.max-this.oxygen.max/8));
		else if(this.state=="normal")
			return(this.lightHaloDist);
		else	return 0;
	}
	
	
	
	/**
	* Tests
	*
	isOutOfScreen: function()
	{
		if(this.center.x <= 0 || this.center.x >= 500 || this.center.y <= 0 || this.center.y >= 340)
			return true;
		return false;
	}
	*/
}
