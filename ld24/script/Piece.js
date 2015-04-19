/**
* Piece.js 
* A piece is composed of one or several blocks (see Block.js) based on a specific piece pattern (PiecePattern).
* The piece class handles its block(s) behaviour.
*/

/** Classic tetris piece patterns **/
const T_W = 5;
const T_H = 5;

const TETRIS_I = [
	[0,0,1,0,0],
	[0,0,1,0,0],
	[0,0,1,0,0],
	[0,0,1,0,0],
	[0,0,0,0,0],
];
const TETRIS_O = [
	[0,0,0,0,0],
	[0,1,1,0,0],
	[0,1,1,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
];
const TETRIS_T = [
	[0,0,0,0,0],
	[0,1,1,1,0],
	[0,0,1,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
];
const TETRIS_J = [
	[0,0,0,0,0],
	[0,1,1,1,0],
	[0,0,0,1,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
];
const TETRIS_L = [
	[0,0,0,0,0],
	[0,1,1,1,0],
	[0,1,0,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
];
const TETRIS_S = [
	[0,0,0,0,0],
	[0,0,1,1,0],
	[0,1,1,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
];
const TETRIS_Z = [
	[0,0,0,0,0],
	[0,1,1,0,0],
	[0,0,1,1,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
];
// All in one list
const TETRIS_PATTERNS = [TETRIS_Z,TETRIS_S,TETRIS_L,TETRIS_J,TETRIS_T,TETRIS_O,TETRIS_I];


/** 
* PiecePattern class
* This class keep track of all in-game piece patterns and their mutations. 
**/
function PiecePattern(pattern){
	this.pattern = pattern;
}

PiecePattern.prototype = {

	mutate_add:function(){

		// First find all the valid positions where a block could be added to the current piece pattern.
		
		var position_list = [];
		var delta;

		for(var i = 0 ; i < T_W ; ++i){
			for(var j = 0 ; j < T_H ; ++j){
				// Look for a plain block
				if(this.pattern[i][j] == 1){
					// . Left
					if ((delta = j - 1) >= 0) {
						if(this.pattern[i][delta] == 0)
							position_list.push([i,delta]);
					}
					// . Right
					if ((delta = j + 1) < T_W) {
						if(this.pattern[i][delta] == 0)
							position_list.push([i,delta]);
					}
					// . Top
					if ((delta = i - 1) >= 0) {
						if(this.pattern[delta][j] == 0)
							position_list.push([delta,j]);
					}
					// . Bottom
					if ((delta = i + 1) < T_H) {
						if(this.pattern[delta][j] == 0)
							position_list.push([delta,j]);
					}
				}
			}
		} // eof find positions loop
		
		// No valid position
		if(position_list.length == 0)
			return; 
		// Else, we pick one at random...
		var randpos = position_list[Math.floor((Math.random()*position_list.length))];
		// ... and set it to a PLAIN block (1)
		this.pattern[randpos[0]][randpos[1]] = 1;
	},

	mutate_rem:function(){

		// First find all the valid positions where a block could be removed to the current piece pattern.
		// (ie, no discontinuities)
		
		var position_list = [];
		var delta;
		var neighbour_count;

		for(var i = 0 ; i < T_W ; ++i){
			for(var j = 0 ; j < T_H ; ++j){
				// Look for a plain block
				if(this.pattern[i][j] == 1){

					// Count the neighbour number
					// (must be 1)
					neighbour_count = 0;

					// . Left
					if ((delta = j - 1) >= 0) {
						if(this.pattern[i][delta] == 1)
							++neighbour_count;
					}
					// . Right
					if ((delta = j + 1) < T_W) {
						if(this.pattern[i][delta] == 1)
							++neighbour_count;
					}
					// . Top
					if ((delta = i - 1) >= 0) {
						if(this.pattern[delta][j] == 1)
							++neighbour_count;
					}
					// . Bottom
					if ((delta = i + 1) < T_H) {
						if(this.pattern[delta][j] == 1)
							++neighbour_count;
					}
					
					// If only one neighbour, it's a valid position
					if(neighbour_count >= 1 )
						position_list.push([i,j]);
				}

			}
		} // eof find positions loop
		
		// No valid position
		if(position_list.length == 0)
			return; 
		// Else, we pick one at random...
		var randpos = position_list[Math.floor((Math.random()*position_list.length))];
		// ... and set it to a VOID block (0)
		this.pattern[randpos[0]][randpos[1]] = 0;
	},

}

// Static functions to generate piece patterns list
function GeneratePieceViaTetrisPattern(){
	var piece_pattern_list = [];
	for (pattern_id in TETRIS_PATTERNS) {
		piece_pattern_list.push(new PiecePattern(TETRIS_PATTERNS[pattern_id]));
	}
	return piece_pattern_list;
}

/** 
* Piece class
**/

// Where should the piece appear once created?
const PIECE_X_ADJUST = 3;
const PIECE_Y_ADJUST = -3; // Out of screen

function Piece(piece_pattern){
	this.grid_x = 0;
	this.grid_y = 0;
	this.blocks = [];
	this.previous_state = []; // used for undoing rotation
	// Extracts blocks data from given pattern
	this.pattern = piece_pattern.pattern;
	for (var y = 0 ; y < T_H ; ++y){
		for (var x = 0 ; x < T_W ; ++x){
			if( this.pattern[x][y] == 1){
				this.blocks.push(new Block(x,y));
			}
		}
	}
	// Compute intertial center
	this.in_x = 0;
	this.in_y = 0;
	this.computeInertialCenter();
	// Just appeared
	this.is_at_origin = true;
}

Piece.prototype = {

	// Center-x and put out of screen (top)
	adjustStartPosition:function(){
		this.grid_x = PIECE_X_ADJUST;
		this.grid_y = PIECE_Y_ADJUST;
		for (elt in this.blocks){
			this.blocks[elt].grid_x+=PIECE_X_ADJUST;
			this.blocks[elt].grid_y+=PIECE_Y_ADJUST;
		}
		this.computeInertialCenter();
	},

	// Must be called everytime that the inner pattern changes
	// .. used for rotation
	computeInertialCenter:function(){
		this.in_x = 0;
		this.in_y = 0;
		for ( block_id in this.blocks ){
			this.in_x += this.blocks[block_id].grid_x;
			this.in_y += this.blocks[block_id].grid_y;
		}
		this.in_x /= this.blocks.length;
		this.in_y /= this.blocks.length;

		//Debug([this.in_x,this.in_y])
	},

	/** 
	* COLLISION DETECTION UTILITY FUNCTIONS 
	*
	* These function will return blocks exposed to a specific side.
	* Example with the 'T' block, and the RIGHT side:
	*
	*	O                     O
	*	OO   --(returns)-->    O
	*	O                     O
	*/
	getBlockExposedFromLeft:function(){
		var block_list = {};
		var y_ref;
		for ( block_id in this.blocks ){
			y_ref = this.blocks[block_id].grid_y;
			// First time we check a block on this y level
			if (!(y_ref in block_list))
				block_list[y_ref] = this.blocks[block_id];
			// Else, we have to see if the current block is more on the left
			// ... compared to what we currently stored
			else{
				if( block_list[y_ref].grid_x > this.blocks[block_id].grid_x )
					block_list[y_ref] = this.blocks[block_id]; // We switch with the one that is more on the left
			}
		}
		return block_list;
	},
	getBlockExposedFromRight:function(){
		var block_list = {};
		var y_ref;
		for ( block_id in this.blocks ){
			y_ref = this.blocks[block_id].grid_y;
			// First time we check a block on this y level
			if (!(y_ref in block_list))
				block_list[y_ref] = this.blocks[block_id];
			// Else, we have to see if the current block is more on the left
			// ... compared to what we currently stored
			else{
				if( block_list[y_ref].grid_x < this.blocks[block_id].grid_x )
					block_list[y_ref] = this.blocks[block_id]; // We switch with the one that is more on the left
			}
		}
		return block_list;
	},
	getBlockExposedFromBottom:function(){
		var block_list = {};
		var x_ref;
		for ( block_id in this.blocks ){
			x_ref = this.blocks[block_id].grid_x;
			// First time we check a block on this x level
			if (!(x_ref in block_list))
				block_list[x_ref] = this.blocks[block_id];
			// Else, we have to see if the current block is more on the left
			// ... compared to what we currently stored
			else{
				if( block_list[x_ref].grid_y < this.blocks[block_id].grid_y )
					block_list[x_ref] = this.blocks[block_id]; // We switch with the one that is more on the left
			}
		}
		return block_list;
	},

	// Add special block to current block set
	addSpecialBlock:function(){
		var randomId = Math.floor((Math.random()*this.blocks.length));
		this.blocks[randomId].setBlockType(Math.floor((Math.random()*3)));
	},

	rotate:function(){
	
		var block_copy;
		this.previous_state = [];
			
		for ( block_id in this.blocks ){

			// Save previous state
			block_copy = new Block(this.blocks[block_id].grid_x,this.blocks[block_id].grid_y);
			block_copy.setBlockType(this.blocks[block_id].block_type);
			this.previous_state.push(block_copy);
			

			var x_pos = this.blocks[block_id].grid_x;
			var y_pos = this.blocks[block_id].grid_y;
		
			// Translate so that the origin of the translation is the inertial point
			x_pos -= this.in_x;
			y_pos -= this.in_y;
			// Do a PI/2 rotation  (x,y) --> (-y,x)
			var temp = x_pos;
			x_pos = -y_pos;
			y_pos = temp;
			// Translate back
			x_pos += this.in_x;
			y_pos += this.in_y;

			this.blocks[block_id].grid_x = Math.round(x_pos);
			this.blocks[block_id].grid_y = Math.round(y_pos);

		}
	},

	undoRotate:function(){
		
		var block_copy;
		this.blocks = [];

		for ( block_id in this.previous_state ){
			// Restore previous state
			block_copy = new Block(this.previous_state[block_id].grid_x,this.previous_state[block_id].grid_y);
			block_copy.setBlockType(this.previous_state[block_id].block_type);
			this.blocks.push(block_copy);
		}
	},

	move:function(dx,dy){
		for ( block_id in this.blocks )
			this.blocks[block_id].move(dx,dy);
		// Need to adjust inertial center as well
		this.computeInertialCenter();

		this.is_at_origin = false;
	},

	render:function(renderer,view){
		for ( block_id in this.blocks )
			this.blocks[block_id].render(renderer,view);
	},




}





