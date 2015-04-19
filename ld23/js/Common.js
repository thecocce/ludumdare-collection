// Keyboard
const KEY_LEFT= 37;
const KEY_LEFT2 = 65;
const KEY_UP= 38;
const KEY_UP2 = 87;
const KEY_RIGHT= 39;
const KEY_RIGHT2 = 68;
const KEY_DOWN= 40;
const KEY_DOWN2 = 83;
const KEY_FIRE = 32; // space_bar
const KEY_FIRE2 = 86; // c key

// Menu
const MENU_VOID = 0;
const MENU_PLAY = 1;
const MENU_ABOUT = 2;

// Game
const game_fps = 50;
const screen_width = 640;
const screen_height = 384;
const grid_width = screen_width/1;//5;  optimization
const grid_height = screen_height/1;///3; optimization

// Hero
const evo_range = 5;
const hero_max_z = 4;
const hero_speed = 3;
const hero_speed_max = hero_speed + evo_range;
const hero_shoot_rate = 48;
const hero_shoot_rate_max = hero_shoot_rate - evo_range*5;
const hero_bullet_speed = 4;
const hero_bullet_speed_max = hero_bullet_speed + evo_range;
const hero_bullet_nb = 1;
const hero_bullet_nb_max = evo_range;
const hero_bullet_power = 1;
const hero_bullet_power_max = evo_range;

// Bullets
const bullet_dir_right = 0;
const bullet_dir_left = Math.PI;
const bullet_dir_diag_right_top = Math.PI/4;
const bullet_dir_diag_right_bottom = -Math.PI/4;
const bullet_dir_top = Math.PI/2;
const bullet_dir_bottom = -Math.PI/2;
const bullet_dir_diag_left_top = 3*Math.PI/4;
const bullet_dir_diag_left_bottom = -3*Math.PI/4;

// Texture defines
const WAT = 0; // Water
const STO = 1; // Stone
const WOO = 3; // Wood

// Tile
const tile_size = 32; // 32 x 32 px
const iso_effect_size = 8;

// Code extension
function randBonus(){
	var poss = ["mov_speed","bul_speed","bul_nb","shoot_rate"];
	return poss[Math.floor((Math.random()*4))];
}


// DEBUG
const OPTI=true;
const DEBUG = true;
function Debug(text){
	if(DEBUG)
		console.log(text);
}