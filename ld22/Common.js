const degToRad = Math.PI/180;
const screenSize = {'w':512,'h':384};

const heroSpeed = 3;
const maxJump = -15;
const gravity = 1;

const KEY_LEFT= 37;
const KEY_LEFT2 = 65;
const KEY_UP= 38;
const KEY_UP2 = 87;
const KEY_RIGHT= 39;
const KEY_RIGHT2 = 68;
const KEY_DOWN= 40;
const KEY_DOWN2 = 83;
const tileSize = 32;
const W=-1;
const S=-6;
const P=-4; // pike
const U=-7; // underwater pike
const F=-8; // fake wall
const A=-21;
const V=-20;

const POWERUP_LIGHT=-2;
const POWERUP_JUMP=-3;
const POWERUP_VIEW=-5;

const B1=-10;
const B2=-11;
const B3=-12;
const B4=-13;
const B5=-14;
const B6=-15;
const B7=-16;

// Misc
const endingHTML="<h2>&#147; You were here &#148;</h2>"

// Debug 
const startLevel=0;
const startX=7;
const startY=4;
