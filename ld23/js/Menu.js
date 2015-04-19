function Menu(){
	
	this.cursor = MENU_PLAY;
	this.choice = MENU_VOID;
	this.menu = "main";
	
	// Hero
	this.tex_hero_eyes = [new Image(),new Image(),new Image(),new Image()];
	this.tex_hero_eyes[1].src = "data/img/menu/menu_hero_eyes1.png";
	this.tex_hero_eyes[2].src = "data/img/menu/menu_hero_eyes2.png";
	this.tex_hero_eyes[3].src = "data/img/menu/menu_hero_eyes3.png";
	this.bonus_eye = 0;
	// Back
	this.tex_back = new Image();
	this.tex_back.src = "data/img/menu/menu_back.png";
	// Title
	this.tex_menu_title = new Image();
	this.tex_menu_title.src = "data/img/menu/menu_title.png";
	// Menu
	this.tex_menu_play = [new Image(),new Image()];
	this.tex_menu_play[0].src = "data/img/menu/menu_play_normal.png";
	this.tex_menu_play[1].src = "data/img/menu/menu_play_selected.png";
	this.tex_menu_about = [new Image(),new Image()];
	this.tex_menu_about[0].src = "data/img/menu/menu_about_normal.png";
	this.tex_menu_about[1].src = "data/img/menu/menu_about_selected.png";
	
}

Menu.prototype = {
	
	draw:function(renderer){
		
		// Main menu, with "Start game" and "About"
		if(this.menu == "main"){
			
			// Draw backround
			renderer.clearRect(0, 0, screen_width, screen_height);
			renderer.drawImage(this.tex_back,0,0,496,133,0,screen_height-130,this.tex_back.width,this.tex_back.height);
			
			// Draw title
			renderer.drawImage(this.tex_menu_title,10,0);
			
			// Draw hero!
			renderer.drawImage(tex_hero,0,0,367,304,130,screen_height/2-70,2*tex_hero.width/3,2*tex_hero.height/3);
			renderer.drawImage(this.tex_hero_eyes[this.bonus_eye],0,0,367,304,130,screen_height/2-70,2*tex_hero.width/3,2*tex_hero.height/3);
			var temp = Math.floor((Math.random()*20)+1); 	// random between 1 and 10
			if(temp == 20){
				this.bonus_eye = Math.floor((Math.random()*4));		
			}
			
			// Draw menu choices
			if(this.cursor==MENU_PLAY){
				renderer.drawImage(this.tex_menu_play[1],450,110);
				renderer.drawImage(this.tex_menu_about[0],440,220);
			}else{
				renderer.drawImage(this.tex_menu_play[0],450,110);
				renderer.drawImage(this.tex_menu_about[1],440,220);
			}
		}
		
	},//eof draw
	
	update:function(keyboard){
		
		if(keyboard[KEY_UP]||keyboard[KEY_UP2]||keyboard[KEY_DOWN]||keyboard[KEY_DOWN2]){
			this.cursor == MENU_PLAY ? this.cursor = MENU_ABOUT : this.cursor = MENU_PLAY;
			// dirty hack collection: avoid immediate repeat
			keyboard[KEY_UP] = false;
			keyboard[KEY_UP2] = false;
			keyboard[KEY_DOWN] = false;
			keyboard[KEY_DOWN2] = false;
		}
		
		if(keyboard[KEY_FIRE])
			this.choice = this.cursor;
		
	},
	
	destroyAssets:function(){
		delete this.tex_hero_eyes;
		delete this.tex_back;
		delete this.tex_menu_title;
		delete this.tex_menu_play;
		delete this.tex_menu_about;
	}
	
}