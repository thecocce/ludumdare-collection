// Display a message at a specific location
function displayText(text,position){
var context = document.getElementById('game').getContext("2d");
context.fillStyle="#fff";
context.textAlign = "center";
//context.textBaseline = position;
context.font = "bold 36px gamefont";
var b=0;
if(position=="top")
    b=50;
else
    b=340;
context.fillText(text, screenSize.w/2, b);
}

function displayTitle(text){
var context = document.getElementById('game').getContext("2d");
context.fillStyle="#fff";
context.textAlign = "center";
context.textBaseline = 'top';
context.font = "bold 90px gamefont";
context.fillText(text, screenSize.w/2, 120);
}