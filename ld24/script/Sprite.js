/**
* Sprite.js
**/

function Sprite(width,height,texture){
	
	this.width = width;
	this.height = height;
	this.rotation_angle = 0;
	this.scale_factor = 1.0;
	this.tex = texture;
	
}


Sprite.prototype = {
	
	/*
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
	*/

/** Sprite Transformation **/
rotate: function(angle){
	this.rotation_angle += angle;
},
setRotationAngle: function(angle){
	this.rotation_angle = angle;
},

scale: function(scale){
	this.scale_factor += scale;
},
setScaleFactor: function(scale){
	this.scale_factor = scale;
},

needSpaceTransform: function(){
	return (this.rotation_angle != 0 || this.scale_factor != 1.0);
},

wrapAngle: function(){
	if(this.rotation_angle >= MATH_TWO_PI)
		this.rotation_angle -= MATH_TWO_PI;
	else if(this.rotation_angle < 0)
		this.rotation_angle += MATH_TWO_PI;
},


render: function(renderer,x,y){

	var pos_x = x;
	var pos_y = y;

	var isTransformed = this.needSpaceTransform();

	// We can't transform directly a texture, only the canvas 'context' can be transformed.
	// To do the trick, we transform the context space, draw the texture,
	// and then set the context to its initial state.
	if(isTransformed){
		// Save canvas context initial state;
		renderer.save();
		// . Rotation
		if(this.rotation_angle != 0){
			// Wrap current rotation angle into [0,2PI]
			this.wrapAngle();
			// Set texture location onto the symmetry center
			renderer.translate(pos_x+this.width/2,pos_y+this.height/2);
			renderer.rotate(-this.rotation_angle);
			// Put back the rendered texture on its original position
			renderer.translate(-pos_x-this.width/2,-pos_y-this.height/2);
		}
		// . Scale
		if(this.scale_factor != 1){
			// Set texture location onto the symmetry center
			renderer.translate(pos_x+this.width/2,pos_y+this.height/2);	
			// Set texture location onto the symmetry center
			renderer.scale(this.scale_factor,this.scale_factor);
			// Put back the rendered texture on its original position
			renderer.translate(-pos_x-this.width/2,-pos_y-this.height/2);
		}
	}
	
	// Render texture (into transformed space if this one was modified previously)
	renderer.drawImage(this.tex,pos_x,pos_y);
	
	// If needed, set the context in its previous state
	if(isTransformed)
		renderer.restore();
},

/*
	render: function(renderer,x,y){
		// this.animate();

		// We can't rotate directly a texture, only the canvas 'context' can be rotated
		// To do the trick, we rotate the context in the inverse angle, draw the texture,
		// and then rotate again so that the context returns to its initial state.
		if(this.rotation_angle != 0)
			renderer.rotate(-this.rotation_angle);

		// Render texture
		// renderer.strokeRect(x,y,this.width,this.height);// HITBOXES 
		renderer.drawImage(this.tex,this.width*this.frame.current,0,this.width,this.height,x,y,this.width,this.height);

		// Set the context in its previous state
		if(this.rotation_angle != 0)
			renderer.rotate(this.rotation_angle);
	},
	
*/
	
}