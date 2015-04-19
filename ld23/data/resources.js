/**
 * GAME IMAGES
 **/

// Hero
// . textures
var tex_fly_body = new Image();
tex_fly_body.src = "data/img/hero/hero_normal.png";
// . sprites
var sprite_fly_body = {
	'width':72,
	'height':36,
	'display_rate':0.5, 
	'frame_nb':3,
	'tex':tex_fly_body,
}
var tex_hero = new Image();
tex_hero.src = "data/img/menu/menu_hero.png";


// Enemies
var tex_en_lilfly = new Image();
tex_en_lilfly.src = "data/img/enemies/lilfly.png"
var sprite_en_lilfly = {
	'width':50,
	'height':50,
	'display_rate':1, 
	'frame_nb':3,
	'tex':tex_en_lilfly,
}

var tex_en_golden = new Image();
tex_en_golden.src = "data/img/enemies/golden.png"
var sprite_en_golden = {
	'width':50,
	'height':50,
	'display_rate':2, 
	'frame_nb':3,
	'tex':tex_en_golden,
}


// Bullets
var tex_bullet_1 = new Image();
tex_bullet_1.src = "data/img/hero/bullet_1.png";

// Bonus
var tex_bonus_1 =  new Image();
tex_bonus_1.src = "data/img/bonus/bonus_1.png";
var tex_bonus_2 =  new Image();
tex_bonus_2.src = "data/img/bonus/bonus_2.png";
var tex_bonus_3 =  new Image();
tex_bonus_3.src = "data/img/bonus/bonus_3.png";
var tex_bonus_4 =  new Image();
tex_bonus_4.src = "data/img/bonus/bonus_4.png";

// . sprites
var sprite_bullet_1 = {
	'width':7,
	'height':7,
	'display_rate':1, 
	'frame_nb':1,
	'tex':tex_bullet_1,
}

// Background textures
var tex_background_1 = new Image();
tex_background_1.src = "data/img/background/land_1.png";
var tex_background_2 = new Image();
tex_background_2.src = "data/img/background/land_2.png";

var tex_cloud_1 = new Image();
tex_cloud_1.src = "data/img/background/cloud_1.png";
var tex_cloud_2 = new Image();
tex_cloud_2.src = "data/img/background/cloud_2.png";
var tex_cloud_3 = new Image();
tex_cloud_3.src = "data/img/background/cloud_3.png";
var tex_cloud_4 = new Image();
tex_cloud_4.src = "data/img/background/cloud_4.png";
var tex_cloud_5= new Image();
tex_cloud_5.src = "data/img/background/cloud_5.png";
var tex_cloud_6 = new Image();
tex_cloud_6.src = "data/img/background/cloud_6.png";
var tex_cloud_7 = new Image();
tex_cloud_7.src = "data/img/background/cloud_7.png";

// Sounds
var music_main = AudioFX('data/sounds/music.mp3',{volume:0.5,loop:true});
var sound_shoot = AudioFX('data/sounds/shoot.wav',{volume:0.5,pool:1});
var sound_destroy = AudioFX('data/sounds/destroy1.wav',{volume:0.5,pool:1});
var sound_bonus = AudioFX('data/sounds/bonus.wav',{volume:0.5,pool:1});
var sound_hurt = AudioFX('data/sounds/hurt.wav',{volume:0.5,pool:1});

//window.onbeforeunload = function(){music_main.stop();}