// x,y,sprite,pattern,speed,life,amplitude,frequence
// patterns: track, sinus, straight

//-----------------------------------------------------
// LIL'FLY
function engen_str(sprite,y,speed,life){
	return {
		'x': screen_width+20,
		'y': y,
		'sprite': sprite,
		'pattern': "straight",
		'speed': speed,
		'life': life,
		'amplitude':null,
		'frequence':null,
	};	
}
function engen_tra(sprite,x,y,speed,life){
	return {
		'x': x,
		'y': y,
		'sprite': sprite,
		'pattern': "track",
		'speed': speed,
		'life': life,
		'amplitude':null,
		'frequence':null,
	};	
}
function engen_sin(sprite,y,speed,life,amplitude,frequence){
	return {
		'x': screen_width+20,
		'y': y,
		'sprite': sprite,
		'pattern': "sinus",
		'speed': speed,
		'life': life,
		'amplitude': amplitude,
		'frequence': frequence,
	};	
}
//------------------------------------------------------