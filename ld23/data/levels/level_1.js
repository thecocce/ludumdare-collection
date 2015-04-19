// engen_lilfly_str(y,speed,life)
// engen_lilfly_tra(x,y,speed,life)
// function engen_lilfly_sin(y,speed,life,amplitude,frequence)

// mov_speed
// bul_speed
// bul_nb
// bul_power


var level_1 = {
	
	'w1':[
		{'en': engen_str(sprite_en_lilfly,25,1,1), 'sound':'beep1' , 'bonus':null, 'nb':1, 'next': {'type':'timer','t':200} },
		{'en': engen_str(sprite_en_lilfly,100,1,1), 'sound':'beep1', 'bonus':null, 'nb':1, 'next': {'type':'timer','t':50} },
		{'en': engen_str(sprite_en_lilfly,200,1,1), 'sound':'beep1', 'bonus':null, 'nb':1, 'next': {'type':'timer','t':50} },
		{'en': engen_str(sprite_en_golden,300,1,2), 'sound':'beep1', 'bonus':"mov_speed", 'nb':1, 'next': {'type':'timer','t':50} },
	],
	'w2':[
		{'en': engen_tra(sprite_en_golden,screen_width,150,1,2), 'bonus':'bul_nb', 'nb':1, 'next': {'type':'timer','t':200} },
	],
	
	'w3':[
		{'en': engen_sin(sprite_en_lilfly,100,2,1,5,50), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':300} },
		{'en': engen_sin(sprite_en_lilfly,200,2,1,5,50), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':50} },
		{'en': engen_sin(sprite_en_lilfly,300,2,2,5,50), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':50} },
	],

	'w4':[
		{'en': engen_str(sprite_en_lilfly,50,2,1), 'sound':'beep1' , 'bonus':null, 'nb':3, 'next': {'type':'timer','t':50} },
		{'en': engen_str(sprite_en_lilfly,100,2,1), 'sound':'beep1', 'bonus':null, 'nb':3, 'next': {'type':'timer','t':50} },
		{'en': engen_str(sprite_en_lilfly,150,2,1), 'sound':'beep1', 'bonus':null, 'nb':3, 'next': {'type':'timer','t':50} },
		{'en': engen_str(sprite_en_lilfly,200,2,1), 'sound':'beep1', 'bonus':null, 'nb':3, 'next': {'type':'timer','t':50} },
		{'en': engen_str(sprite_en_lilfly,250,2,1), 'sound':'beep1', 'bonus':null, 'nb':3, 'next': {'type':'timer','t':50} },	
		{'en': engen_str(sprite_en_lilfly,250,2,1), 'sound':'beep1', 'bonus':null, 'nb':3, 'next': {'type':'timer','t':50} },	
		{'en': engen_str(sprite_en_golden,300,2,1), 'sound':'beep1', 'bonus':null, 'nb':1, 'next': {'type':'timer','t':100} },
	],
	
	// 3 x sin consecutives
	'w5':[
		{'en': engen_sin(sprite_en_lilfly,100,2,1,6,50), 'bonus':null, 'nb':4, 'next': {'type':'timer','t':10} },
		{'en': engen_sin(sprite_en_golden,100,2,1,6,50), 'bonus':randBonus(), 'nb':1, 'next': {'type':'timer','t':10} },
		{'en': engen_sin(sprite_en_lilfly,250,2,1,6,50), 'bonus':null, 'nb':4, 'next': {'type':'timer','t':10} },
		{'en': engen_sin(sprite_en_golden,250,2,1,6,50), 'bonus':randBonus(), 'nb':1, 'next': {'type':'timer','t':10} },
	],
	
	// wave of tracks
	'w6':[
		{'en': engen_tra(sprite_en_lilfly,screen_width,10,2,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':320} },
		{'en': engen_tra(sprite_en_lilfly,screen_width,350,2,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
		{'en': engen_tra(sprite_en_lilfly,screen_width,10,2,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':50} },
		{'en': engen_tra(sprite_en_lilfly,screen_width,350,2,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
		{'en': engen_tra(sprite_en_lilfly,screen_width,10,2,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':50} },
		{'en': engen_tra(sprite_en_lilfly,screen_width,350,2,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
	],

	// parrallel straight
	'w7':[
		{'en': engen_str(sprite_en_lilfly,10,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':300} },
		{'en': engen_str(sprite_en_lilfly,350,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
		
		{'en': engen_str(sprite_en_lilfly,40,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':50} },
		{'en': engen_str(sprite_en_lilfly,320,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
		
		{'en': engen_str(sprite_en_lilfly,70,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':50} },
		{'en': engen_str(sprite_en_lilfly,290,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
		
		{'en': engen_str(sprite_en_lilfly,100,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':50} },
		{'en': engen_str(sprite_en_lilfly,260,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
		
		{'en': engen_str(sprite_en_lilfly,130,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':50} },
		{'en': engen_str(sprite_en_lilfly,230,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
		
		{'en': engen_str(sprite_en_lilfly,160,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':50} },
		{'en': engen_str(sprite_en_lilfly,200,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
		
		{'en': engen_tra(sprite_en_golden,screen_width,190,3,2), 'bonus':randBonus(), 'nb':1, 'next': {'type':'timer','t':50} },
	],
	
	
	// sin + str
	'w8':[
	
		{'en': engen_str(sprite_en_lilfly,100,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':300} },
		{'en': engen_str(sprite_en_lilfly,280,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
		{'en': engen_sin(sprite_en_lilfly,screen_height/2,2,1,8,50), 'bonus':null, 'nb':3, 'next': {'type':'timer','t':10} },
		{'en': engen_sin(sprite_en_golden,screen_height/2,2,1,8,50), 'bonus':randBonus(), 'nb':1, 'next': {'type':'timer','t':10} },
		
		{'en': engen_str(sprite_en_lilfly,100,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':200} },
		{'en': engen_str(sprite_en_lilfly,280,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
		{'en': engen_str(sprite_en_lilfly,150,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
		{'en': engen_str(sprite_en_lilfly,220,3,2), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':1} },
		{'en': engen_sin(sprite_en_lilfly,screen_height/2,2,1,8,50), 'bonus':null, 'nb':3, 'next': {'type':'timer','t':10} },
		{'en': engen_sin(sprite_en_golden,screen_height/2,2,1,8,50), 'bonus':randBonus(), 'nb':1, 'next': {'type':'timer','t':10} },
	],
	
	'wend':[
	
		{'en': engen_str(sprite_en_lilfly,500,1,1), 'bonus':null, 'nb':1, 'next': {'type':'timer','t':650} },
	
	],
	
	
	
	
	
	
	
	
	
	
	
}