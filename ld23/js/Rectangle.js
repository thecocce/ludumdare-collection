function Rectangle(x,y,width,height)
{
	this.x=x;
	this.y=y;
	this.x2=this.x+width;
	this.y2=this.y+height;
	this.width=width;
	this.height=height;
}


Rectangle.prototype = 
{
	collideWith: function(rect){
	
	return( 	!( rect.x > this.x2 
		        || rect.x2 < this.x 
		        || rect.y > this.y2 
		        || rect.y2 < this.y 
		        )
			);	
	},
	
	update: function(){
		this.x2=this.x+this.width;
		this.y2=this.y+this.height;
	},
	
	isOut:function(){
		if(this.x<-50 || this.x2 > screen_width+100 )
			return true;
		else 
			return false;
		
	}
	
}