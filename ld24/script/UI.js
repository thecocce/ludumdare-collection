/**
* UI - Classes
* 
* User Interface Elements:
* - "What's the next piece" box 
* - Score counter
* - Button (menu etc...)
* - Ambient text (customizable)
**/


/** 
* UI_NextPIece 
**/

function UI_NextPiece(x,y){
	// Screen disposition
	this.pos_x = x;
	this.pos_y = y;
	// Piece to display
	this.piece_pattern_id = -1;
	this.piece = null;
	this.is_mutated = false;
}

UI_NextPiece.prototype = {

	setNextPiece:function(piece_pattern_id,piece){
		this.piece_pattern_id = piece_pattern_id;
		this.piece = piece;
		this.is_mutated = false;
	},

	// A piece can be 5*5 blocks
	render:function(renderer){
		// Draw frame
		renderer.fillStyle="rgba(0, 0, 0, 0.6)";
		renderer.fillRect(this.pos_x,this.pos_y,UNIT_WIDTH*5+4,UNIT_HEIGHT*5+4);
		renderer.strokeStyle="silver";
		renderer.strokeRect(this.pos_x,this.pos_y,UNIT_WIDTH*5+4,UNIT_HEIGHT*5+4);
		// Draw block pattern
		this.piece.render(renderer,{'x':this.pos_x+UNIT_WIDTH*(2-this.piece.in_x),'y':this.pos_y+UNIT_HEIGHT*(2-this.piece.in_y)});
		if(this.is_mutated){
			renderer.fillStyle="#fff";
			renderer.textAlign = "Center";
			renderer.font = "bold 100px Arial";
			// . Realtime FPS
			renderer.fillText("?", this.pos_x+UNIT_WIDTH*2,this.pos_y+UNIT_HEIGHT*2);
		}
	},

}

/** 
* UI_ScoreCounter
**/

function UI_ScoreCounter(x,y){
	// Screen disposition
	this.pos_x = x;
	this.pos_y = y;
	// Internal data
	this.score = 0;
	this.displayed_score = 0;
}

UI_ScoreCounter.prototype = {

	addValue:function(value){
		this.score += value;
	},

	addValueRealtime:function(value){
		this.score += value;
		this.displayed_score += value;
	},

	// Increase displayed score value if needed
	update:function(){
		if(this.displayed_score < this.score)
		{
			var factor = Math.floor((this.score-this.displayed_score)/10);
			if(factor < 1)
				factor = 1;
			this.displayed_score+=factor;
		}
		else
			this.displayed_score = this.score;
	},

	render:function(renderer){
		renderer.fillStyle="#fff";
		renderer.textAlign = "Left";
		renderer.font = "bold 30px Verdana";
		renderer.fillText("Score", this.pos_x,this.pos_y);
		renderer.fillText(this.displayed_score, this.pos_x,this.pos_y+1.5*UNIT_HEIGHT);
	},

}


/** 
* UI_LineCounter
**/

function UI_LineCounter(x,y){
	// Screen disposition
	this.pos_x = x;
	this.pos_y = y;
	// Internal data
	this.counter = 0;
}

UI_LineCounter.prototype = {

	addValue:function(value){
		this.counter += value;
	},

	render:function(renderer){
		renderer.fillStyle="#fff";
		renderer.textAlign = "Left";
		renderer.font = "bold 30px Verdana";
		renderer.fillText("Lines", this.pos_x,this.pos_y);
		renderer.fillText(this.counter, this.pos_x,this.pos_y+1.5*UNIT_HEIGHT);
	},

}
