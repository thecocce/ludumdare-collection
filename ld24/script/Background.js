/**
* Background.js
* This background is corresponding to the place where the blocks are stacking.
**/

function Background(width,height){

	this.width = width*UNIT_WIDTH;
	this.height = height*UNIT_HEIGHT;

	this.point = {'x':0,'y':0,'dx':5,'dy':5};
}

Background.prototype = {

	render: function(renderer,view){
		var color = 255;
		// Create radial gradient
		grad = renderer.createRadialGradient(0,0,0,0,0,600); 
		grad.addColorStop(0, '#000');
		grad.addColorStop(1, 'rgb(' + color + ', ' + color + ', ' + color + ')');

		// assign gradients to fill
		renderer.fillStyle = grad;

		// draw 600x600 fill
		renderer.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

		// Move point
		this.point['x']+=this.point['dx'];
		this.point['y']+=this.point['dy'];
		if(this.point['x'] < 0){ 
			this.point['dx']*=-1;
			this.point['x'] = 0;
		}
		if(this.point['y'] < 0){ 
			this.point['dy']*=-1;
			this.point['y'] = 0;
		}
		if(this.point['x'] > SCREEN_WIDTH){ 
			this.point['dx']*=-1;
			this.point['x'] = SCREEN_WIDTH;
		}
		if(this.point['y'] > SCREEN_HEIGHT){ 
			this.point['dy']*=-1;
			this.point['y'] = SCREEN_HEIGHT;
		}

		var width = 1000, 
			height = 800, 
        x = this.point['x'], 
        y = this.point['y'],
        rx = SCREEN_WIDTH * x / width,
        ry = SCREEN_HEIGHT * y / height;
        
	    var xc = ~~(256 * x / width);
	    var yc = ~~(256 * y / height);

	    grad = renderer.createRadialGradient(rx, ry, 0, rx, ry, 600); 
	    grad.addColorStop(0, '#000');
	    grad.addColorStop(1, ['rgb(', xc, ', ', (255 - xc), ', ', yc, ')'].join(''));
	    
		renderer.fillStyle = grad;
		renderer.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
		

		// Draw borders level
		renderer.fillStyle = "rgba(0, 0, 0, 0.6)";
		renderer.fillRect(view.x,view.y,this.width,this.height);
		renderer.strokeStyle = "silver"
		renderer.strokeRect(view.x,view.y,this.width,this.height);
		

	},

}