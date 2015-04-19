#!/bin/bash
#
# Ordered file list is the following:
# ../script/plugins/buzz.js
# ../script/Common.js
# ../script/ResourceManager.js
# ../script/Sprite.js
# ../script/Block.js
# ../script/Piece.js
# ../script/Background.js
# ../script/UI.js
# ../script/EvolutiveMusic.js
# ../script/Level.js
# ../script/Game.js
# ../script/Main.js
#
# output file => game.min.js
#
# compress with http://www.refresh-sf.com/yui using YUI Compressor 2.4.7
#
SRC=../script/
OUT=./game.js
if [ ! -f $OUT ]
then 
	rm $OUT
else
	touch $OUT
fi
cat $SRC"plugins/buzz.js" $SRC"Common.js" $SRC"ResourceManager.js" $SRC"Sprite.js" $SRC"Block.js" $SRC"Piece.js" $SRC"Background.js" $SRC"UI.js" $SRC"EvolutiveMusic.js" $SRC"Level.js" $SRC"Game.js" $SRC"Main.js" > $OUT