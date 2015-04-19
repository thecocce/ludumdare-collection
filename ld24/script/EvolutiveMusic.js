/**
* EvolutiveMusic
**/

function EvolutiveMusic(){

	this.level = 1;
	// 3 Ambient musics
	this.tracks = {
	// . No problem
	  	1:game.resource_manager.music_list['music1'],
	// . Average
		2:game.resource_manager.music_list['music2'],
	// . Watch out
		3:game.resource_manager.music_list['music3'],
	// . Imminent death
		4:game.resource_manager.music_list['music4'],
	};
	this.current_track = this.tracks[1];
	this.current_track_nb = 1;
}

EvolutiveMusic.prototype = {

	setCorrectTrack: function(value){ // value is a %

		var percent = value*100;
		var track_nb = this.current_track_nb;

		// close to 0% <=> almost at top <=> hard !!
		if(percent < 25){
			track_nb = 4;
		}else if(percent < 50){
			track_nb = 3;
		}else if(percent < 75){
			track_nb = 2;
		}
		else
			track_nb = 1;

		// If we need to change the music
		if(this.current_track_nb != track_nb){
			this.current_track_nb = track_nb;
			this.current_track.stop();
			this.current_track = this.tracks[this.current_track_nb];
			this.current_track.play();
		}
	},

	stop:function(){ this.current_track.stop();},
	play:function(){ 
		this.current_track.play();
	},

	playGameOverMusic:function(){ this.current_track.stop();},

}