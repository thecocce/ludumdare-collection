/**
* Level.js
* -----------
* Inheritance
* -----------
* "Let <YourLevel> be the class inheriting from Level."
* YourLevel.prototype = new Level();        // Here's where the inheritance occurs 
* YourLevel.prototype.constructor=YourLevel;       // Otherwise instances of YourLevel would have a constructor of Level 
*
**/

// Consts
const LEVEL_GRID_WIDTH = 10;
const LEVEL_GRID_HEIGHT = 18;

function Level(game_ref)
{
	// Infos
	this.game = game_ref;
	
	// Grid information
	this.grid_width = LEVEL_GRID_WIDTH;
	this.grid_height = LEVEL_GRID_HEIGHT;
	this.grid_view = {'x':UNIT_WIDTH*4,'y':UNIT_HEIGHT}; // The view is the relative position
	
	// Internal counters
	this.update_counter = 0 ;
	this.keyrepeat_counter  = 0;

	// Score and values
	this.difficulty = 0.5 ;
	this.score_before_level_up = 10;
	this.max_height = LEVEL_GRID_HEIGHT;

	this.tetris_count = 0;
	this.mystic_tetris_count = 0;
	this.mutation_count = 0;

	// Generate default piece patterns
	this.piece_pattern_list = GeneratePieceViaTetrisPattern();

	// Music
	this.music = new EvolutiveMusic();
	this.music.play();

	// Blocks array
	this.blocks = [];
	// Fill level with empty blocks
	var line = [];
	for( var i = 0 ; i < this.grid_width ; ++i)
		this.blocks[i] = new Array(this.grid_height);

	// GAMEPLAY INSTRUCTION, 
	/*// . add 9 blocks on the bottom + 1 red
	for(var x = 0 ; x < this.grid_width-1 ; ++x){ 
		this.blocks[x][this.grid_height-1] = new Block(x,this.grid_height-1);
	}
	this.blocks[0][this.grid_height-1].setBlockType(2);
	// . add 9 blocks on the bottom + 1 green
	for(var x = 1 ; x < this.grid_width ; ++x){ 
		this.blocks[x][this.grid_height-2] = new Block(x,this.grid_height-2);
	}
	this.blocks[1][this.grid_height-2].setBlockType(1);
	*/


	// Start background
	this.background = new Background(this.grid_width,this.grid_height);

	// User Interface
	// . Next piece
	this.UI_next_piece = new UI_NextPiece(UNIT_WIDTH*17.25,UNIT_HEIGHT*6);
	this.generateNextPiece();
	// . Score counter
	this.UI_score_counter = new UI_ScoreCounter(UNIT_WIDTH*17.5,UNIT_HEIGHT*13);
	// . Line counter
	this.UI_line_counter = new UI_LineCounter(UNIT_WIDTH*17.5,UNIT_HEIGHT*16.5);

	// Add first falling piece
	this.falling_piece = this.generateRandomPiece();

	// Gameover ?
	this.is_finished = false;

		// dirty hack to avoid continuous key press
		this.disable_space = false;
		this.disable_pause = false;
}


// Prototype : shared by all instances
Level.prototype = 
{	
	
	update: function(keyboard)
	{

		// PAUSE
		if(keyboard[KEY_PAUSE]){
			// dirty hack to avoid continuous space key press
			if(!this.disable_pause){
				this.is_paused = !this.is_paused;	
				// Change music state
				if(this.is_paused)
					this.music.stop();
				else
					this.music.play();

			}
			this.disable_pause = true;
		}	
		else this.disable_pause = false;

		if(this.is_paused)
			return;

		/** 
		* FRAME UPDATE
		* Level elements or events that need to be checked at every frame.
		**/
		this.UI_score_counter.update();


		/**
		* Keyboard events
		* With a 10 frames key-repeat limit.
		**/
		if(++this.keyrepeat_counter >= KEY_REPEAT){

			// Reset counter
			this.keyrepeat_counter = 0;

			// FALLING PIECE
			if(this.falling_piece){
				// . Move Left
				if(keyboard[KEY_LEFT]){
					
					// Collision test
					var block_list = this.falling_piece.getBlockExposedFromLeft();
					var x_ref = 0;
					var can_move = true;

					for(y_ref in block_list){
						// Compute x_ref
						x_ref = block_list[y_ref].grid_x-1;
						// Out of borders?
						if(x_ref < 0){
							can_move = false;
							break;
						}
						// Overlaps with another block?
						if (this.blocks[x_ref][y_ref] != null){
							can_move = false;
							break;
						}
					}
					if(can_move)
						this.falling_piece.move(-1,0);
				}
				// . Move Right
				else if(keyboard[KEY_RIGHT]){
					
					// Collision test
					var block_list = this.falling_piece.getBlockExposedFromRight();
					var x_ref = 0;
					var can_move = true;

					for(y_ref in block_list){
						// Compute x_ref
						x_ref = block_list[y_ref].grid_x+1;
						// Out of borders?
						if(x_ref >= this.grid_width){
							can_move = false;
							break;
						}
						// Overlaps with another block?
						if (this.blocks[x_ref][y_ref] != null){
							can_move = false;
							break;
						}
					}
					if(can_move)
						this.falling_piece.move(1,0);
				}

				// . Fall quickly
				if(keyboard[KEY_DOWN]){
					// Collision test
					var block_list = this.falling_piece.getBlockExposedFromBottom();
					var y_ref = 0;
					var can_move = true;

					for(x_ref in block_list){
						// Compute y_ref
						y_ref = block_list[x_ref].grid_y+1;
						// Out of borders?
						if(y_ref >= this.grid_height){
							can_move = false;
							break;
						}
						// Overlaps with another block?
						if (this.blocks[x_ref][y_ref] != null){
							can_move = false;
							break;
						}
					}
					// If we can move, we also add some bonus score
					if(can_move){
						this.falling_piece.move(0,1);
						this.UI_score_counter.addValueRealtime(1); // realtime because too small value
					}
				}
				// . Rotation
				if(keyboard[KEY_SPACE]){
					// dirty hack to avoid continuous space key press
					if(!this.disable_space){
						// To check if the rotation is valid, we first rotate the piece internally
						// ... and then see if we have any collision
						this.falling_piece.rotate();

						// Collision testS
						var can_move = true;
						var current_block = null;		
						for( block_id in this.falling_piece.blocks){
							current_block = this.falling_piece.blocks[block_id];
							// Out of border ?
							if(current_block.grid_x < 0 || current_block.grid_x >= this.grid_width){
								can_move = false;
								break;
							}
							else if (current_block.grid_y >= this.grid_height){
								can_move = false;
								break;
							}
							// Overlap with another block
							else if (this.blocks[current_block.grid_x][current_block.grid_y] != null){
								can_move = false;
								break;
							}
						}
						
						// If we definitely can't move, then we unrotate, else we keep the piece as is
						if(!can_move) 
							this.falling_piece.undoRotate();
						else
							// Sound
							game.resource_manager.sound_list['switch'].play();

					// eof collision tests and stuff	
					}
					this.disable_space = true;
				}	
				else this.disable_space = false;

			}
		}
		
		/** 
		* STEP UPDATE 
		* We update here all components that are synchronised with the level current difficulty 
		* (For instance, a step is corresponding to 60 frames at difficulty 1)
		**/
		if(++this.update_counter >= this.difficulty * FPS)
		{
			// Reset counter
			this.update_counter = 0;

			// If there's not piece falling currently, we need to add one
			if(!this.falling_piece)
			{
				this.falling_piece = this.UI_next_piece.piece;
				this.falling_piece.adjustStartPosition();
				this.generateNextPiece();
			}
			// Else, we move that piece forward
			else{

				// Collision test
				var block_list = this.falling_piece.getBlockExposedFromBottom();
				var y_ref = 0;
				var can_move = true;

				for(x_ref in block_list){
					// Compute y_ref
					y_ref = block_list[x_ref].grid_y+1;
					// Out of borders?
					if(y_ref >= this.grid_height){
						can_move = false;
						break;
					}
					// Overlaps with another block?
					if (this.blocks[x_ref][y_ref] != null){
						can_move = false;
						break;
					}
				}
				if(can_move)
					this.falling_piece.move(0,1);
				// Else, it means we have reached the floor
				else{
					// Sound
					game.resource_manager.sound_list['block'].play();
					// Weld with ground when ready
					this.weldFallingPiece();
				}
			}

			// Check for lines
			this.checkLines();
		}


	},
	
	// Draw the ship directly on the canvas
	render: function()
	{
	
		// Draw background
		this.background.render(this.game.renderer,this.grid_view);
		
		// Draw blocks
		for(var y = 0 ; y < this.grid_height ; ++y){
			for (var x = 0 ; x < this.grid_width ; ++x) {
				
				// If there's a block to draw
				if(this.blocks[x][y]){
					this.blocks[x][y].render(this.game.renderer,this.grid_view);
				}
				// Else, the value is 'null', we draw an empty box
				//this.sprite.render(this.game,);
			}
		}
		
		// Falling piece
		if(this.falling_piece)
			this.falling_piece.render(this.game.renderer,this.grid_view);

		// User interface
		this.UI_next_piece.render(this.game.renderer);
		this.UI_score_counter.render(this.game.renderer);
		this.UI_line_counter.render(this.game.renderer);
	},
	

	/** UTILITY FUNCTIONS **/
	generateRandomPiece: function()
	{
		var new_piece = new Piece(this.piece_pattern_list[Math.floor((Math.random()*this.piece_pattern_list.length))]);
		// Test
		new_piece.adjustStartPosition();
		new_piece.addSpecialBlock();

		return new_piece;
	},

	generateNextPiece: function(){
		var pattern_id = Math.floor((Math.random()*this.piece_pattern_list.length));
		var new_piece = new Piece(this.piece_pattern_list[pattern_id]);
		new_piece.addSpecialBlock();
		this.UI_next_piece.setNextPiece(pattern_id,new_piece);
	},

	updateNextPieceAfterBonus: function(){
		var pattern_id = this.UI_next_piece.piece_pattern_id;
		var new_piece = new Piece(this.piece_pattern_list[pattern_id]);
		new_piece.addSpecialBlock();
		this.UI_next_piece.setNextPiece(pattern_id,new_piece);
		this.UI_next_piece.is_mutated = true;
	},

	// Once the falling piece hit the floor, we weld it with currents blocks
	weldFallingPiece: function()
	{
		// If the piece hasn't move, then it's gameover
		if(this.falling_piece.is_at_origin){
			this.is_finished = true;
			this.gameOver();
			return;
		}

		// Weld each block independently
		var new_block;
		for( id in this.falling_piece.blocks){
			new_block = this.falling_piece.blocks[id];
			this.blocks[new_block.grid_x][new_block.grid_y] = new_block;
			// Is max_height reached?
			if(new_block.grid_y < this.max_height){
				this.max_height =  new_block.grid_y;
				// Update music according to current height
				this.music.setCorrectTrack(this.max_height/LEVEL_GRID_HEIGHT)
			}
		}
		// There's no falling piece anymore
		this.falling_piece = null;
	},

	/** SCORE AND GAMEOVER **/

	scoredLines:function(line_number){
		// Line counter
		this.UI_line_counter.addValue(line_number);

		// Sound
		if(line_number < 4)
			game.resource_manager.sound_list['bonus'].play();
		else
			game.resource_manager.sound_list['tetris'].play();

		// Bonus score counter
		var bonus = 0;
		switch(line_number){
			case 2:
				bonus = BONUS_2_LINES;
				break;
			case 3:
				bonus = BONUS_3_LINES;
				break;
			case 4:
				bonus = BONUS_4_LINES;
				break;
			case 5:
				bonus = BONUS_5_LINES;
				break;
			default:
				bonus = BONUS_1_LINES;
				break;
		}
		this.UI_score_counter.addValue(bonus);

		// Change difficulty
		if(this.UI_line_counter.counter >= this.score_before_level_up){
			this.difficulty-=0.05
			if(this.difficulty < 0)
				this.difficulty = 0;
			this.score_before_level_up+=10;
			game.resource_manager.sound_list['level'].play();
		}

	},

	checkLines:function(){
		// Look for complete lines
		var line_complete;
		var mutate = {"add":0,"rem":0};
		var line_number = 0;
		for( var line = 0 ; line < this.grid_height ; ++line )
		{
			line_complete = true;
			for ( var x = 0 ; x < this.grid_width ; ++x){
				// Check every consecutive block of this line
				if(!this.blocks[x][line]){
					line_complete = false;
					break;
				}
				// If there's a special block
				if(this.blocks[x][line].block_type == BLOCK_MUTATE_ADD)
					++mutate['add'];
				else if(this.blocks[x][line].block_type == BLOCK_MUTATE_REM)
					++mutate['rem'];
			}
			// If every block was indeed a block
			if(line_complete){
				line_number++;
				this.applyGravity(line);
				// Apply bonus to next piece
				// . MUTATE ADD
				if(mutate['add']>0)
				{	
					this.piece_pattern_list[this.UI_next_piece.piece_pattern_id].mutate_add();
					++this.mutation_count;
					// Update next piece
					this.updateNextPieceAfterBonus();
				}
				// . MUTATE REM
				if(mutate['rem']>0)	// . MUTATE REM
				{	
					this.piece_pattern_list[this.UI_next_piece.piece_pattern_id].mutate_rem();
					++this.mutation_count;
					// Update next piece
					this.updateNextPieceAfterBonus();
				}
			}
		}
		// Update score if needed
		if(line_number>0)
			this.scoredLines(line_number);
	},

	applyGravity:function(line_id){
		var current_block;
		var max_height = LEVEL_GRID_HEIGHT;
		// Delete current line
		//for (var x = 0 ; x < this.grid_width ; ++x)
		//	this.blocks[x][line_id] = null;
		// Scroll down each block at a higher level
		for( var line = line_id ; line > 0 ; --line )
		{ 
			for (var x = 0 ; x < this.grid_width ; ++x){
				// Move block
				current_block = this.blocks[x][line];
				if(current_block){
					current_block.move(0,1);
					// Find max height
					if(current_block.grid_y < max_height)
						max_height = current_block.grid_y;
				}
				// Update matrix
				this.blocks[x][line] = this.blocks[x][line-1];
			}
		}
		// Update max height
		this.max_height =  max_height;
		// Update music according to current height
		this.music.setCorrectTrack(this.max_height/LEVEL_GRID_HEIGHT)

	},

	gameOver:function(){
		// Music change :/
		this.music.playGameOverMusic();
		// Display at the top-right side of the screen
		this.game.renderer.fillStyle="gold";
		this.game.renderer.textAlign = "center";
		this.game.renderer.font = "bold 20px Arial";
		// . Realtime FPS
		this.game.renderer.fillText("GAME OVER", this.game.surface.width/2, this.game.surface.height/2);
	}
	
	
	
}