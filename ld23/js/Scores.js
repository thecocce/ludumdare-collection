function Scores(renderer){
	
	this.total = 0;
	this.lifes = 3;
	this.bonus = 0;
}


Scores.prototype = {
	
	
	draw:function(renderer){
		// Display a message at a specific location
		renderer.fillStyle="#fff";
		renderer.textAlign = "left";
		renderer.font = "bold 36px Arial";
		renderer.fillText("Score: "+ this.total, 6, 30);
		
	},
}