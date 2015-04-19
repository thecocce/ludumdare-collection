// ----------------------------------------------------------------------------
// Buzz, a Javascript HTML5 Audio library
// v 1.0.4 beta
// Licensed under the MIT license.
// http://buzz.jaysalvat.com/
// ----------------------------------------------------------------------------
// Copyright (C) 2011 Jay Salvat
// http://jaysalvat.com/
// ----------------------------------------------------------------------------
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files ( the "Software" ), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// ----------------------------------------------------------------------------

var buzz = {
    defaults: {
        autoplay: false,
        duration: 5000,
        formats: [],
        loop: false,
        placeholder: '--',
        preload: 'metadata',
        volume: 80
    },
    types: {
        'mp3': 'audio/mpeg',
        'ogg': 'audio/ogg',
        'wav': 'audio/wav',
        'aac': 'audio/aac',
        'm4a': 'audio/x-m4a'
    },
    sounds: [],
    el: document.createElement( 'audio' ),

    sound: function( src, options ) {
        options = options || {};

        var pid = 0,
            events = [],
            eventsOnce = {},
            supported = buzz.isSupported();

        // publics
        this.load = function() {
            if ( !supported ) {
              return this;
            }

            this.sound.load();
            return this;
        };

        this.play = function() {
            if ( !supported ) {
              return this;
            }

            this.sound.play();
            return this;
        };

        this.togglePlay = function() {
            if ( !supported ) {
              return this;
            }

            if ( this.sound.paused ) {
                this.sound.play();
            } else {
                this.sound.pause();
            }
            return this;
        };

        this.pause = function() {
            if ( !supported ) {
              return this;
            }

            this.sound.pause();
            return this;
        };

        this.isPaused = function() {
            if ( !supported ) {
              return null;
            }

            return this.sound.paused;
        };

        this.stop = function() {
            if ( !supported  ) {
              return this;
            }

            this.setTime( this.getDuration() );
            this.sound.pause();
            return this;
        };

        this.isEnded = function() {
            if ( !supported ) {
              return null;
            }

            return this.sound.ended;
        };

        this.loop = function() {
            if ( !supported ) {
              return this;
            }

            this.sound.loop = 'loop';
            this.bind( 'ended.buzzloop', function() {
                this.currentTime = 0;
                this.play();
            });
            return this;
        };

        this.unloop = function() {
            if ( !supported ) {
              return this;
            }

            this.sound.removeAttribute( 'loop' );
            this.unbind( 'ended.buzzloop' );
            return this;
        };

        this.mute = function() {
            if ( !supported ) {
              return this;
            }

            this.sound.muted = true;
            return this;
        };

        this.unmute = function() {
            if ( !supported ) {
              return this;
            }

            this.sound.muted = false;
            return this;
        };

        this.toggleMute = function() {
            if ( !supported ) {
              return this;
            }

            this.sound.muted = !this.sound.muted;
            return this;
        };

        this.isMuted = function() {
            if ( !supported ) {
              return null;
            }

            return this.sound.muted;
        };

        this.setVolume = function( volume ) {
            if ( !supported ) {
              return this;
            }

            if ( volume < 0 ) {
              volume = 0;
            }
            if ( volume > 100 ) {
              volume = 100;
            }
          
            this.volume = volume;
            this.sound.volume = volume / 100;
            return this;
        };
      
        this.getVolume = function() {
            if ( !supported ) {
              return this;
            }

            return this.volume;
        };

        this.increaseVolume = function( value ) {
            return this.setVolume( this.volume + ( value || 1 ) );
        };

        this.decreaseVolume = function( value ) {
            return this.setVolume( this.volume - ( value || 1 ) );
        };

        this.setTime = function( time ) {
            if ( !supported ) {
              return this;
            }

            this.whenReady( function() {
                this.sound.currentTime = time;
            });
            return this;
        };

        this.getTime = function() {
            if ( !supported ) {
              return null;
            }

            var time = Math.round( this.sound.currentTime * 100 ) / 100;
            return isNaN( time ) ? buzz.defaults.placeholder : time;
        };

        this.setPercent = function( percent ) {
            if ( !supported ) {
              return this;
            }

            return this.setTime( buzz.fromPercent( percent, this.sound.duration ) );
        };

        this.getPercent = function() {
            if ( !supported ) {
              return null;
            }

			var percent = Math.round( buzz.toPercent( this.sound.currentTime, this.sound.duration ) );
            return isNaN( percent ) ? buzz.defaults.placeholder : percent;
        };

        this.setSpeed = function( duration ) {
			if ( !supported ) {
              return this;
            }

            this.sound.playbackRate = duration;
        };

        this.getSpeed = function() {
			if ( !supported ) {
              return null;
            }

            return this.sound.playbackRate;
        };

        this.getDuration = function() {
            if ( !supported ) {
              return null;
            }

            var duration = Math.round( this.sound.duration * 100 ) / 100;
            return isNaN( duration ) ? buzz.defaults.placeholder : duration;
        };

        this.getPlayed = function() {
			if ( !supported ) {
              return null;
            }

            return timerangeToArray( this.sound.played );
        };

        this.getBuffered = function() {
			if ( !supported ) {
              return null;
            }

            return timerangeToArray( this.sound.buffered );
        };

        this.getSeekable = function() {
			if ( !supported ) {
              return null;
            }

            return timerangeToArray( this.sound.seekable );
        };

        this.getErrorCode = function() {
            if ( supported && this.sound.error ) {
                return this.sound.error.code;
            }
            return 0;
        };

        this.getErrorMessage = function() {
			if ( !supported ) {
              return null;
            }

            switch( this.getErrorCode() ) {
                case 1:
                    return 'MEDIA_ERR_ABORTED';
                case 2:
                    return 'MEDIA_ERR_NETWORK';
                case 3:
                    return 'MEDIA_ERR_DECODE';
                case 4:
                    return 'MEDIA_ERR_SRC_NOT_SUPPORTED';
                default:
                    return null;
            }
        };

        this.getStateCode = function() {
			if ( !supported ) {
              return null;
            }

            return this.sound.readyState;
        };

        this.getStateMessage = function() {
			if ( !supported ) {
              return null;
            }

            switch( this.getStateCode() ) {
                case 0:
                    return 'HAVE_NOTHING';
                case 1:
                    return 'HAVE_METADATA';
                case 2:
                    return 'HAVE_CURRENT_DATA';
                case 3:
                    return 'HAVE_FUTURE_DATA';
                case 4:
                    return 'HAVE_ENOUGH_DATA';
                default:
                    return null;
            }
        };

        this.getNetworkStateCode = function() {
			if ( !supported ) {
              return null;
            }

            return this.sound.networkState;
        };

        this.getNetworkStateMessage = function() {
			if ( !supported ) {
              return null;
            }

            switch( this.getNetworkStateCode() ) {
                case 0:
                    return 'NETWORK_EMPTY';
                case 1:
                    return 'NETWORK_IDLE';
                case 2:
                    return 'NETWORK_LOADING';
                case 3:
                    return 'NETWORK_NO_SOURCE';
                default:
                    return null;
            }
        };

        this.set = function( key, value ) {
            if ( !supported ) {
              return this;
            }

            this.sound[ key ] = value;
            return this;
        };

        this.get = function( key ) {
            if ( !supported ) {
              return null;
            }

            return key ? this.sound[ key ] : this.sound;
        };

        this.bind = function( types, func ) {
            if ( !supported ) {
              return this;
            }

            types = types.split( ' ' );

            var that = this,
				efunc = function( e ) { func.call( that, e ); };

            for( var t = 0; t < types.length; t++ ) {
                var type = types[ t ],
                    idx = type;
                    type = idx.split( '.' )[ 0 ];

                    events.push( { idx: idx, func: efunc } );
                    this.sound.addEventListener( type, efunc, true );
            }
            return this;
        };

        this.unbind = function( types ) {
            if ( !supported ) {
              return this;
            }

            types = types.split( ' ' );

            for( var t = 0; t < types.length; t++ ) {
                var idx = types[ t ],
                    type = idx.split( '.' )[ 0 ];

                for( var i = 0; i < events.length; i++ ) {
                    var namespace = events[ i ].idx.split( '.' );
                    if ( events[ i ].idx == idx || ( namespace[ 1 ] && namespace[ 1 ] == idx.replace( '.', '' ) ) ) {
                        this.sound.removeEventListener( type, events[ i ].func, true );
                        delete events[ i ];
                    }
                }
            }
            return this;
        };

        this.bindOnce = function( type, func ) {
            if ( !supported ) {
              return this;
            }

            var that = this;

            eventsOnce[ pid++ ] = false;
            this.bind( pid + type, function() {
               if ( !eventsOnce[ pid ] ) {
                   eventsOnce[ pid ] = true;
                   func.call( that );
               }
               that.unbind( pid + type );
            });
        };

        this.trigger = function( types ) {
            if ( !supported ) {
              return this;
            }

            types = types.split( ' ' );

            for( var t = 0; t < types.length; t++ ) {
                var idx = types[ t ];

                for( var i = 0; i < events.length; i++ ) {
                    var eventType = events[ i ].idx.split( '.' );
                    if ( events[ i ].idx == idx || ( eventType[ 0 ] && eventType[ 0 ] == idx.replace( '.', '' ) ) ) {
                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent( eventType[ 0 ], false, true );
                        this.sound.dispatchEvent( evt );
                    }
                }
            }
            return this;
        };

        this.fadeTo = function( to, duration, callback ) {
			if ( !supported ) {
              return this;
            }

            if ( duration instanceof Function ) {
                callback = duration;
                duration = buzz.defaults.duration;
            } else {
                duration = duration || buzz.defaults.duration;
            }

            var from = this.volume,
				delay = duration / Math.abs( from - to ),
                that = this;
            this.play();

            function doFade() {
                setTimeout( function() {
                    if ( from < to && that.volume < to ) {
                        that.setVolume( that.volume += 1 );
                        doFade();
                    } else if ( from > to && that.volume > to ) {
                        that.setVolume( that.volume -= 1 );
                        doFade();
                    } else if ( callback instanceof Function ) {
                        callback.apply( that );
                    }
                }, delay );
            }
            this.whenReady( function() {
                doFade();
            });

            return this;
        };

        this.fadeIn = function( duration, callback ) {
            if ( !supported ) {
              return this;
            }

            return this.setVolume(0).fadeTo( 100, duration, callback );
        };

        this.fadeOut = function( duration, callback ) {
			if ( !supported ) {
              return this;
            }

            return this.fadeTo( 0, duration, callback );
        };

        this.fadeWith = function( sound, duration ) {
            if ( !supported ) {
              return this;
            }

            this.fadeOut( duration, function() {
                this.stop();
            });

            sound.play().fadeIn( duration );

            return this;
        };

        this.whenReady = function( func ) {
            if ( !supported ) {
              return null;
            }

            var that = this;
            if ( this.sound.readyState === 0 ) {
                this.bind( 'canplay.buzzwhenready', function() {
                    func.call( that );
                });
            } else {
                func.call( that );
            }
        };

        // privates
        function timerangeToArray( timeRange ) {
            var array = [],
                length = timeRange.length - 1;

            for( var i = 0; i <= length; i++ ) {
                array.push({
                    start: timeRange.start( length ),
                    end: timeRange.end( length )
                });
            }
            return array;
        }

        function getExt( filename ) {
            return filename.split('.').pop();
        }
        
        function addSource( sound, src ) {
            var source = document.createElement( 'source' );
            source.src = src;
            if ( buzz.types[ getExt( src ) ] ) {
                source.type = buzz.types[ getExt( src ) ];
            }
            sound.appendChild( source );
        }

        // init
        if ( supported ) {
          
            for(var i in buzz.defaults ) {
              if(buzz.defaults.hasOwnProperty(i)) {
                options[ i ] = options[ i ] || buzz.defaults[ i ];
              }
            }

            this.sound = document.createElement( 'audio' );

            if ( src instanceof Array ) {
                for( var j in src ) {
                  if(src.hasOwnProperty(j)) {
                    addSource( this.sound, src[ j ] );
                  }
                }
            } else if ( options.formats.length ) {
                for( var k in options.formats ) {
                  if(options.formats.hasOwnProperty(k)) {
                    addSource( this.sound, src + '.' + options.formats[ k ] );
                  }
                }
            } else {
                addSource( this.sound, src );
            }

            if ( options.loop ) {
                this.loop();
            }

            if ( options.autoplay ) {
                this.sound.autoplay = 'autoplay';
            }

            if ( options.preload === true ) {
                this.sound.preload = 'auto';
            } else if ( options.preload === false ) {
                this.sound.preload = 'none';
            } else {
                this.sound.preload = options.preload;
            }

            this.setVolume( options.volume );

            buzz.sounds.push( this );
        }
    },

    group: function( sounds ) {
        sounds = argsToArray( sounds, arguments );

        // publics
        this.getSounds = function() {
            return sounds;
        };

        this.add = function( soundArray ) {
            soundArray = argsToArray( soundArray, arguments );
            for( var a = 0; a < soundArray.length; a++ ) {
                sounds.push( soundArray[ a ] );
            }
        };

        this.remove = function( soundArray ) {
            soundArray = argsToArray( soundArray, arguments );
            for( var a = 0; a < soundArray.length; a++ ) {
                for( var i = 0; i < sounds.length; i++ ) {
                    if ( sounds[ i ] == soundArray[ a ] ) {
                        delete sounds[ i ];
                        break;
                    }
                }
            }
        };

        this.load = function() {
            fn( 'load' );
            return this;
        };

        this.play = function() {
            fn( 'play' );
            return this;
        };

        this.togglePlay = function( ) {
            fn( 'togglePlay' );
            return this;
        };

        this.pause = function( time ) {
            fn( 'pause', time );
            return this;
        };

        this.stop = function() {
            fn( 'stop' );
            return this;
        };

        this.mute = function() {
            fn( 'mute' );
            return this;
        };

        this.unmute = function() {
            fn( 'unmute' );
            return this;
        };

        this.toggleMute = function() {
            fn( 'toggleMute' );
            return this;
        };

        this.setVolume = function( volume ) {
            fn( 'setVolume', volume );
            return this;
        };

        this.increaseVolume = function( value ) {
            fn( 'increaseVolume', value );
            return this;
        };

        this.decreaseVolume = function( value ) {
            fn( 'decreaseVolume', value );
            return this;
        };

        this.loop = function() {
            fn( 'loop' );
            return this;
        };

        this.unloop = function() {
            fn( 'unloop' );
            return this;
        };

        this.setTime = function( time ) {
            fn( 'setTime', time );
            return this;
        };

        this.setduration = function( duration ) {
            fn( 'setduration', duration );
            return this;
        };

        this.set = function( key, value ) {
            fn( 'set', key, value );
            return this;
        };

        this.bind = function( type, func ) {
            fn( 'bind', type, func );
            return this;
        };

        this.unbind = function( type ) {
            fn( 'unbind', type );
            return this;
        };

        this.bindOnce = function( type, func ) {
            fn( 'bindOnce', type, func );
            return this;
        };

        this.trigger = function( type ) {
            fn( 'trigger', type );
            return this;
        };

        this.fade = function( from, to, duration, callback ) {
            fn( 'fade', from, to, duration, callback );
            return this;
        };

        this.fadeIn = function( duration, callback ) {
            fn( 'fadeIn', duration, callback );
            return this;
        };

        this.fadeOut = function( duration, callback ) {
            fn( 'fadeOut', duration, callback );
            return this;
        };

        // privates
        function fn() {
            var args = argsToArray( null, arguments ),
                func = args.shift();

            for( var i = 0; i < sounds.length; i++ ) {
                sounds[ i ][ func ].apply( sounds[ i ], args );
            }
        }

        function argsToArray( array, args ) {
            return ( array instanceof Array ) ? array : Array.prototype.slice.call( args );
        }
    },

    all: function() {
      return new buzz.group( buzz.sounds );
    },

    isSupported: function() {
        return !!buzz.el.canPlayType;
    },

    isOGGSupported: function() {
        return !!buzz.el.canPlayType && buzz.el.canPlayType( 'audio/ogg; codecs="vorbis"' );
    },

    isWAVSupported: function() {
        return !!buzz.el.canPlayType && buzz.el.canPlayType( 'audio/wav; codecs="1"' );
    },

    isMP3Supported: function() {
        return !!buzz.el.canPlayType && buzz.el.canPlayType( 'audio/mpeg;' );
    },

    isAACSupported: function() {
        return !!buzz.el.canPlayType && ( buzz.el.canPlayType( 'audio/x-m4a;' ) || buzz.el.canPlayType( 'audio/aac;' ) );
    },

    toTimer: function( time, withHours ) {
        var h, m, s;
        h = Math.floor( time / 3600 );
        h = isNaN( h ) ? '--' : ( h >= 10 ) ? h : '0' + h;
        m = withHours ? Math.floor( time / 60 % 60 ) : Math.floor( time / 60 );
        m = isNaN( m ) ? '--' : ( m >= 10 ) ? m : '0' + m;
        s = Math.floor( time % 60 );
        s = isNaN( s ) ? '--' : ( s >= 10 ) ? s : '0' + s;
        return withHours ? h + ':' + m + ':' + s : m + ':' + s;
    },

    fromTimer: function( time ) {
        var splits = time.toString().split( ':' );
        if ( splits && splits.length == 3 ) {
            time = ( parseInt( splits[ 0 ], 10 ) * 3600 ) + ( parseInt(splits[ 1 ], 10 ) * 60 ) + parseInt( splits[ 2 ], 10 );
        }
        if ( splits && splits.length == 2 ) {
            time = ( parseInt( splits[ 0 ], 10 ) * 60 ) + parseInt( splits[ 1 ], 10 );
        }
        return time;
    },

    toPercent: function( value, total, decimal ) {
		var r = Math.pow( 10, decimal || 0 );

		return Math.round( ( ( value * 100 ) / total ) * r ) / r;
    },

    fromPercent: function( percent, total, decimal ) {
		var r = Math.pow( 10, decimal || 0 );

        return  Math.round( ( ( total / 100 ) * percent ) * r ) / r;
    }
};
/**
* Common.js
**/


/**
* Global flags and consts
**/
// Flags
const DEBUG = false;
const OPTI = false; // Experimental and non-stable stuff (can actually optimize)

const T_TEX = 1;
const T_SOUND = 2;
const T_MUSIC = 4;

// Consts
const SCREEN_WIDTH = 640; // Screen size
const SCREEN_HEIGHT = 500;
const UNIT_WIDTH = 25; // Square block size
const UNIT_HEIGHT = 25;  

const FPS = 60; // Change this value doesn't affect animation speed (see "requestAnimFrame" function below)

const MATH_PI = Math.PI;
const MATH_PI_HALF = MATH_PI/2;
const MATH_TWO_PI = 2*MATH_PI;

const MEDIA_TEX_PATH = "media/textures/";
const MEDIA_SOUND_PATH = "media/sounds/";

const KEY_REPEAT = 4; // keyboard imput is read every KEY_REPEAT frames

const KEY_LEFT= 37;
const KEY_LEFT2 = 65;
const KEY_UP= 38;
const KEY_UP2 = 87;
const KEY_RIGHT= 39;
const KEY_RIGHT2 = 68;
const KEY_DOWN= 40;
const KEY_DOWN2 = 83;
const KEY_SPACE = 32; // space_bar
const KEY_C = 86; // c key
const KEY_PAUSE = 80; // p key
const KEY_RESTART = 82; // r key

const BONUS_1_LINES = 100;
const BONUS_2_LINES = 300;
const BONUS_3_LINES = 800;
const BONUS_4_LINES = 2000;
const BONUS_5_LINES = 10000;



/** DEBUG **/
function Debug(text){
	if(DEBUG)
		console.log(text);
}

/** EXPERIMENTAL **/
function E_TimeNow(){
	//if(OPTI)
		// HTML5 High Resolution Timer : http://updates.html5rocks.com/2012/08/When-milliseconds-are-not-enough-performance-now
	//	return Date.now(); //return window.performance.webkitNow();
	//else
		// Classic Date object (less acurate)
		return new Date().getTime();

}

/** 
* Request Animation Frame function by Paul Irish (@paul_irish). 
* Synchronise animations at 60 FPS using browser specific API.
* Learn more at: http://paulirish.com/2011/requestanimationframe-for-smart-animating/ 
**/
window.requestAnimFrame = 	
			(function()
				{
					return  window.requestAnimationFrame || 
					window.webkitRequestAnimationFrame || 
					window.mozRequestAnimationFrame    || 
					window.oRequestAnimationFrame      || 
					window.msRequestAnimationFrame     || 
					function(/* function */ callback, /* DOMElement */ element)
					{
						window.setTimeout(callback, 1000 / 60);
					};
				}
			)();

/**
* C-style sleep function.
* For test purpose.
**/
function sleep(millis) 
{
	var date = new Date();
	var curDate = null;
	do { curDate = new Date(); } 
	while(curDate-date < millis);
} /**
* ResourcesManager :
*
* ResourcesLoader  : Load resource via DOM objects.
* ResourcesProvider : Give game access to loaded resources.
* File : Encapsulate resource loading (can be either image or sound).
*/

/**
* File
*/
function File(file_type,file_name,callback_func)
{
	this.file_type = (file_type & T_TEX) | (file_type & T_SOUND) | (file_type & T_MUSIC);
	if(!this.file_type) Debug("File > Error, file_type undefined...")
	this.file_name = file_name;
	this.callback_func = callback_func;
	this.file = null;
}

File.prototype =
{
	load: function()
	{
		Debug("ResourcesLoader > File '" + this.file_name + "' is loading...");
		var self = this;
		// file_type ?
		switch(this.file_type){
			// . Texture
			case T_TEX:
				this.file = new Image();
				this.file.src = MEDIA_TEX_PATH + this.file_name;
				this.file.onload = function(){self.done(self);};
				break;
			// . Sound
			case T_SOUND:
				this.file = new buzz.sound(MEDIA_SOUND_PATH+this.file_name, {formats: [ "wav" ],loop: false,});
				this.file.load();
				this.file.decreaseVolume(50); // Sounds effects have a lower volume
				this.file.bind("canplaythrough",function(){self.done(self);});
				break;
			// . Music
			case T_MUSIC:
				this.file = new buzz.sound(MEDIA_SOUND_PATH+this.file_name, {formats: [ "ogg" ],loop: true,});
				this.file.load();this.file.load();
				this.file.decreaseVolume(20);
				this.file.bind("canplaythrough",function(){self.done(self);});
				break;
		}
	},

	done: function(self)
	{
		Debug("ResourcesLoader > File '" + self.file_name + "' loaded!");
		self.callback_func(self);
	},

}

/**
* ResourceLoader
**/
function ResourcesLoader(resource_manager,file_list,callback_func)
{
	this.resource_manager = resource_manager;
	this.file_queue = file_list;
	this.file_nb = this.file_queue['tex'].length+this.file_queue['sound'].length+this.file_queue['music'].length;
	this.callback_func = callback_func; // This function is called once every thing is loaded.
	Debug("ResourcesLoader > " + this.file_nb + " file on the load list.");
}

ResourcesLoader.prototype = 
{

	start: function()
	{
		var self = this;
		// Start the loading queue
		// . Textures
		for (file_id in this.file_queue['tex']){
			var tmp = new File(T_TEX,this.file_queue['tex'][file_id],function(file){self.onResourceLoaded(file);});
			tmp.load();
		}
		// . Sounds
		for (file_id in this.file_queue['sound']){
			var tmp = new File(T_SOUND,this.file_queue['sound'][file_id],function(file){self.onResourceLoaded(file);});
			tmp.load();
		}
		// . Musics
		for (file_id in this.file_queue['music']){
			var tmp = new File(T_MUSIC,this.file_queue['music'][file_id],function(file){self.onResourceLoaded(file);});
			tmp.load();
		}
	},

	onResourceLoaded: function(loaded_file)
	{	
		// Add to ResourceManager loaded_file lists
		this.resource_manager.addResource(loaded_file);
		// Check if all the files have been loaded
		if(--this.file_nb <= 0 && !this.resource_manager.ready)
			this.done();
	},

	done: function()
	{
		this.resource_manager.ready = true;
		Debug("callback_func called at the right place.");
		this.callback_func();
	}

}


/**
* ResourceManager
**/

function ResourceManager(){
	this.tex_list = {};
	this.sound_list = {};
	this.music_list = {};
	this.ready = false;
	this.loader = null;
}

ResourceManager.prototype = {

	loadFiles: function(file_list,callback_func){
		var self = this;
		this.loader = new ResourcesLoader(this,file_list,function(){ callback_func();});
		this.loader.start();
	},

	addResource: function(loaded_file){

		switch(loaded_file.file_type){
			case T_TEX:
				this.tex_list[loaded_file.file_name] = loaded_file.file;
				break;
			case T_SOUND:
				this.sound_list[loaded_file.file_name] = loaded_file.file;
				break;
			case T_MUSIC:
				this.music_list[loaded_file.file_name] = loaded_file.file;
				break;
		} 
	},

	getTexture: function(name){
		if(name in this.tex_list)
			return this.tex_list[name];
		else 
			return undefined;
	},
}
/**
* Sprite.js
**/

function Sprite(width,height,texture){
	
	this.width = width;
	this.height = height;
	this.rotation_angle = 0;
	this.scale_factor = 1.0;
	this.tex = texture;
	
}


Sprite.prototype = {
	
	/*
	animate: function(){
		
		// Animation frames
		// . Display rate
		if(this.display.rate_counter++ >= this.display.rate_max){
			// Switch to next animation frame
			if(++this.frame.current >= this.frame.number)
				this.frame.current = 0;
			this.display.rate_counter = 0;
		}
		
	},
	*/

/** Sprite Transformation **/
rotate: function(angle){
	this.rotation_angle += angle;
},
setRotationAngle: function(angle){
	this.rotation_angle = angle;
},

scale: function(scale){
	this.scale_factor += scale;
},
setScaleFactor: function(scale){
	this.scale_factor = scale;
},

needSpaceTransform: function(){
	return (this.rotation_angle != 0 || this.scale_factor != 1.0);
},

wrapAngle: function(){
	if(this.rotation_angle >= MATH_TWO_PI)
		this.rotation_angle -= MATH_TWO_PI;
	else if(this.rotation_angle < 0)
		this.rotation_angle += MATH_TWO_PI;
},


render: function(renderer,x,y){

	var pos_x = x;
	var pos_y = y;

	var isTransformed = this.needSpaceTransform();

	// We can't transform directly a texture, only the canvas 'context' can be transformed.
	// To do the trick, we transform the context space, draw the texture,
	// and then set the context to its initial state.
	if(isTransformed){
		// Save canvas context initial state;
		renderer.save();
		// . Rotation
		if(this.rotation_angle != 0){
			// Wrap current rotation angle into [0,2PI]
			this.wrapAngle();
			// Set texture location onto the symmetry center
			renderer.translate(pos_x+this.width/2,pos_y+this.height/2);
			renderer.rotate(-this.rotation_angle);
			// Put back the rendered texture on its original position
			renderer.translate(-pos_x-this.width/2,-pos_y-this.height/2);
		}
		// . Scale
		if(this.scale_factor != 1){
			// Set texture location onto the symmetry center
			renderer.translate(pos_x+this.width/2,pos_y+this.height/2);	
			// Set texture location onto the symmetry center
			renderer.scale(this.scale_factor,this.scale_factor);
			// Put back the rendered texture on its original position
			renderer.translate(-pos_x-this.width/2,-pos_y-this.height/2);
		}
	}
	
	// Render texture (into transformed space if this one was modified previously)
	renderer.drawImage(this.tex,pos_x,pos_y);
	
	// If needed, set the context in its previous state
	if(isTransformed)
		renderer.restore();
},

/*
	render: function(renderer,x,y){
		// this.animate();

		// We can't rotate directly a texture, only the canvas 'context' can be rotated
		// To do the trick, we rotate the context in the inverse angle, draw the texture,
		// and then rotate again so that the context returns to its initial state.
		if(this.rotation_angle != 0)
			renderer.rotate(-this.rotation_angle);

		// Render texture
		// renderer.strokeRect(x,y,this.width,this.height);// HITBOXES 
		renderer.drawImage(this.tex,this.width*this.frame.current,0,this.width,this.height,x,y,this.width,this.height);

		// Set the context in its previous state
		if(this.rotation_angle != 0)
			renderer.rotate(this.rotation_angle);
	},
	
*/
	
}/**
*
* Block.js
*
* A block is the smallest unit in the tetris game.
* A piece is composed of one or several blocks.
* When one or more lines of blocks appears, all the blocks in these lines disappear...
* ... and the player's score increases.
*
*/

/** Game-specific consts **/
const BLOCK_NORMAL = 0;
const BLOCK_MUTATE_ADD = 1;
const BLOCK_MUTATE_REM = 2;

/** Block class **/

function Block(x,y)
{
	this.grid_x = x;
	this.grid_y = y;

	this.is_falling = true;

	this.block_type = BLOCK_NORMAL;
	this.is_bonus = false;
	
	//this.sprite_eyes = new Sprite(25,25,game.resource_manager.tex_list['eye_'+Math.floor((Math.random()*3+1))+'.png']);
	this.sprite_square = new Sprite(25,25,game.resource_manager.tex_list['block_blue.png']);
}

Block.prototype = {

	// NB: No update function

	move: function(dx,dy){
		this.grid_x+=dx;
		this.grid_y+=dy;
	},

	render: function(renderer,view){
		
		/*
		if(VISUAL_EFFECTS)
		{
			if(this.sprite_square.scale_factor < 1.1)
					this.sprite_square.scale_factor+=0.01;
				else if(this.sprite_square.scale_factor >= 1.1)
					this.sprite_square.scale_factor=0.9;
		}
		else	this.sprite_square.scale_factor = 1;
		*/

		this.sprite_square.render(renderer,this.grid_x*UNIT_WIDTH+view.x,this.grid_y*UNIT_HEIGHT+view.y);
		//this.sprite_eyes.render(renderer,this.grid_x*UNIT_WIDTH+view.x,this.grid_y*UNIT_HEIGHT+view.y);
	},

	setBlockType:function(block_type){
		this.block_type = block_type;
		if(this.block_type > 0)
			this.is_bonus = true;
		else
			this.is_bonus = false;
		// Set correct texture basic square
		switch(this.block_type){
			case BLOCK_MUTATE_REM:
				this.sprite_square = new Sprite(25,25,game.resource_manager.tex_list['block_red.png']);
				break;
			case BLOCK_MUTATE_ADD:
				this.sprite_square = new Sprite(25,25,game.resource_manager.tex_list['block_green.png']);
				break;
			default:
				this.sprite_square = new Sprite(25,25,game.resource_manager.tex_list['block_blue.png']);
				break;
		}
	},

}/**
* Piece.js 
* A piece is composed of one or several blocks (see Block.js) based on a specific piece pattern (PiecePattern).
* The piece class handles its block(s) behaviour.
*/

/** Classic tetris piece patterns **/
const T_W = 5;
const T_H = 5;

const TETRIS_I = [
	[0,0,1,0,0],
	[0,0,1,0,0],
	[0,0,1,0,0],
	[0,0,1,0,0],
	[0,0,0,0,0],
];
const TETRIS_O = [
	[0,0,0,0,0],
	[0,1,1,0,0],
	[0,1,1,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
];
const TETRIS_T = [
	[0,0,0,0,0],
	[0,1,1,1,0],
	[0,0,1,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
];
const TETRIS_J = [
	[0,0,0,0,0],
	[0,1,1,1,0],
	[0,0,0,1,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
];
const TETRIS_L = [
	[0,0,0,0,0],
	[0,1,1,1,0],
	[0,1,0,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
];
const TETRIS_S = [
	[0,0,0,0,0],
	[0,0,1,1,0],
	[0,1,1,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
];
const TETRIS_Z = [
	[0,0,0,0,0],
	[0,1,1,0,0],
	[0,0,1,1,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
];
// All in one list
const TETRIS_PATTERNS = [TETRIS_Z,TETRIS_S,TETRIS_L,TETRIS_J,TETRIS_T,TETRIS_O,TETRIS_I];


/** 
* PiecePattern class
* This class keep track of all in-game piece patterns and their mutations. 
**/
function PiecePattern(pattern){
	this.pattern = pattern;
}

PiecePattern.prototype = {

	mutate_add:function(){

		// First find all the valid positions where a block could be added to the current piece pattern.
		
		var position_list = [];
		var delta;

		for(var i = 0 ; i < T_W ; ++i){
			for(var j = 0 ; j < T_H ; ++j){
				// Look for a plain block
				if(this.pattern[i][j] == 1){
					// . Left
					if ((delta = j - 1) >= 0) {
						if(this.pattern[i][delta] == 0)
							position_list.push([i,delta]);
					}
					// . Right
					if ((delta = j + 1) < T_W) {
						if(this.pattern[i][delta] == 0)
							position_list.push([i,delta]);
					}
					// . Top
					if ((delta = i - 1) >= 0) {
						if(this.pattern[delta][j] == 0)
							position_list.push([delta,j]);
					}
					// . Bottom
					if ((delta = i + 1) < T_H) {
						if(this.pattern[delta][j] == 0)
							position_list.push([delta,j]);
					}
				}
			}
		} // eof find positions loop
		
		// No valid position
		if(position_list.length == 0)
			return; 
		// Else, we pick one at random...
		var randpos = position_list[Math.floor((Math.random()*position_list.length))];
		// ... and set it to a PLAIN block (1)
		this.pattern[randpos[0]][randpos[1]] = 1;
	},

	mutate_rem:function(){

		// First find all the valid positions where a block could be removed to the current piece pattern.
		// (ie, no discontinuities)
		
		var position_list = [];
		var delta;
		var neighbour_count;

		for(var i = 0 ; i < T_W ; ++i){
			for(var j = 0 ; j < T_H ; ++j){
				// Look for a plain block
				if(this.pattern[i][j] == 1){

					// Count the neighbour number
					// (must be 1)
					neighbour_count = 0;

					// . Left
					if ((delta = j - 1) >= 0) {
						if(this.pattern[i][delta] == 1)
							++neighbour_count;
					}
					// . Right
					if ((delta = j + 1) < T_W) {
						if(this.pattern[i][delta] == 1)
							++neighbour_count;
					}
					// . Top
					if ((delta = i - 1) >= 0) {
						if(this.pattern[delta][j] == 1)
							++neighbour_count;
					}
					// . Bottom
					if ((delta = i + 1) < T_H) {
						if(this.pattern[delta][j] == 1)
							++neighbour_count;
					}
					
					// If only one neighbour, it's a valid position
					if(neighbour_count >= 1 )
						position_list.push([i,j]);
				}

			}
		} // eof find positions loop
		
		// No valid position
		if(position_list.length == 0)
			return; 
		// Else, we pick one at random...
		var randpos = position_list[Math.floor((Math.random()*position_list.length))];
		// ... and set it to a VOID block (0)
		this.pattern[randpos[0]][randpos[1]] = 0;
	},

}

// Static functions to generate piece patterns list
function GeneratePieceViaTetrisPattern(){
	var piece_pattern_list = [];
	for (pattern_id in TETRIS_PATTERNS) {
		piece_pattern_list.push(new PiecePattern(TETRIS_PATTERNS[pattern_id]));
	}
	return piece_pattern_list;
}

/** 
* Piece class
**/

// Where should the piece appear once created?
const PIECE_X_ADJUST = 3;
const PIECE_Y_ADJUST = -3; // Out of screen

function Piece(piece_pattern){
	this.grid_x = 0;
	this.grid_y = 0;
	this.blocks = [];
	this.previous_state = []; // used for undoing rotation
	// Extracts blocks data from given pattern
	this.pattern = piece_pattern.pattern;
	for (var y = 0 ; y < T_H ; ++y){
		for (var x = 0 ; x < T_W ; ++x){
			if( this.pattern[x][y] == 1){
				this.blocks.push(new Block(x,y));
			}
		}
	}
	// Compute intertial center
	this.in_x = 0;
	this.in_y = 0;
	this.computeInertialCenter();
	// Just appeared
	this.is_at_origin = true;
}

Piece.prototype = {

	// Center-x and put out of screen (top)
	adjustStartPosition:function(){
		this.grid_x = PIECE_X_ADJUST;
		this.grid_y = PIECE_Y_ADJUST;
		for (elt in this.blocks){
			this.blocks[elt].grid_x+=PIECE_X_ADJUST;
			this.blocks[elt].grid_y+=PIECE_Y_ADJUST;
		}
		this.computeInertialCenter();
	},

	// Must be called everytime that the inner pattern changes
	// .. used for rotation
	computeInertialCenter:function(){
		this.in_x = 0;
		this.in_y = 0;
		for ( block_id in this.blocks ){
			this.in_x += this.blocks[block_id].grid_x;
			this.in_y += this.blocks[block_id].grid_y;
		}
		this.in_x /= this.blocks.length;
		this.in_y /= this.blocks.length;

		//Debug([this.in_x,this.in_y])
	},

	/** 
	* COLLISION DETECTION UTILITY FUNCTIONS 
	*
	* These function will return blocks exposed to a specific side.
	* Example with the 'T' block, and the RIGHT side:
	*
	*	O                     O
	*	OO   --(returns)-->    O
	*	O                     O
	*/
	getBlockExposedFromLeft:function(){
		var block_list = {};
		var y_ref;
		for ( block_id in this.blocks ){
			y_ref = this.blocks[block_id].grid_y;
			// First time we check a block on this y level
			if (!(y_ref in block_list))
				block_list[y_ref] = this.blocks[block_id];
			// Else, we have to see if the current block is more on the left
			// ... compared to what we currently stored
			else{
				if( block_list[y_ref].grid_x > this.blocks[block_id].grid_x )
					block_list[y_ref] = this.blocks[block_id]; // We switch with the one that is more on the left
			}
		}
		return block_list;
	},
	getBlockExposedFromRight:function(){
		var block_list = {};
		var y_ref;
		for ( block_id in this.blocks ){
			y_ref = this.blocks[block_id].grid_y;
			// First time we check a block on this y level
			if (!(y_ref in block_list))
				block_list[y_ref] = this.blocks[block_id];
			// Else, we have to see if the current block is more on the left
			// ... compared to what we currently stored
			else{
				if( block_list[y_ref].grid_x < this.blocks[block_id].grid_x )
					block_list[y_ref] = this.blocks[block_id]; // We switch with the one that is more on the left
			}
		}
		return block_list;
	},
	getBlockExposedFromBottom:function(){
		var block_list = {};
		var x_ref;
		for ( block_id in this.blocks ){
			x_ref = this.blocks[block_id].grid_x;
			// First time we check a block on this x level
			if (!(x_ref in block_list))
				block_list[x_ref] = this.blocks[block_id];
			// Else, we have to see if the current block is more on the left
			// ... compared to what we currently stored
			else{
				if( block_list[x_ref].grid_y < this.blocks[block_id].grid_y )
					block_list[x_ref] = this.blocks[block_id]; // We switch with the one that is more on the left
			}
		}
		return block_list;
	},

	// Add special block to current block set
	addSpecialBlock:function(){
		var randomId = Math.floor((Math.random()*this.blocks.length));
		this.blocks[randomId].setBlockType(Math.floor((Math.random()*3)));
	},

	rotate:function(){
	
		var block_copy;
		this.previous_state = [];
			
		for ( block_id in this.blocks ){

			// Save previous state
			block_copy = new Block(this.blocks[block_id].grid_x,this.blocks[block_id].grid_y);
			block_copy.setBlockType(this.blocks[block_id].block_type);
			this.previous_state.push(block_copy);
			

			var x_pos = this.blocks[block_id].grid_x;
			var y_pos = this.blocks[block_id].grid_y;
		
			// Translate so that the origin of the translation is the inertial point
			x_pos -= this.in_x;
			y_pos -= this.in_y;
			// Do a PI/2 rotation  (x,y) --> (-y,x)
			var temp = x_pos;
			x_pos = -y_pos;
			y_pos = temp;
			// Translate back
			x_pos += this.in_x;
			y_pos += this.in_y;

			this.blocks[block_id].grid_x = Math.round(x_pos);
			this.blocks[block_id].grid_y = Math.round(y_pos);

		}
	},

	undoRotate:function(){
		
		var block_copy;
		this.blocks = [];

		for ( block_id in this.previous_state ){
			// Restore previous state
			block_copy = new Block(this.previous_state[block_id].grid_x,this.previous_state[block_id].grid_y);
			block_copy.setBlockType(this.previous_state[block_id].block_type);
			this.blocks.push(block_copy);
		}
	},

	move:function(dx,dy){
		for ( block_id in this.blocks )
			this.blocks[block_id].move(dx,dy);
		// Need to adjust inertial center as well
		this.computeInertialCenter();

		this.is_at_origin = false;
	},

	render:function(renderer,view){
		for ( block_id in this.blocks )
			this.blocks[block_id].render(renderer,view);
	},




}





/**
* Background.js
* This background is corresponding to the place where the blocks are stacking.
**/

function Background(width,height){

	this.width = width*UNIT_WIDTH;
	this.height = height*UNIT_HEIGHT;

	this.point = {'x':0,'y':0,'dx':5,'dy':5};
}

Background.prototype = {

	render: function(renderer,view){
		var color = 255;
		// Create radial gradient
		grad = renderer.createRadialGradient(0,0,0,0,0,600); 
		grad.addColorStop(0, '#000');
		grad.addColorStop(1, 'rgb(' + color + ', ' + color + ', ' + color + ')');

		// assign gradients to fill
		renderer.fillStyle = grad;

		// draw 600x600 fill
		renderer.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

		// Move point
		this.point['x']+=this.point['dx'];
		this.point['y']+=this.point['dy'];
		if(this.point['x'] < 0){ 
			this.point['dx']*=-1;
			this.point['x'] = 0;
		}
		if(this.point['y'] < 0){ 
			this.point['dy']*=-1;
			this.point['y'] = 0;
		}
		if(this.point['x'] > SCREEN_WIDTH){ 
			this.point['dx']*=-1;
			this.point['x'] = SCREEN_WIDTH;
		}
		if(this.point['y'] > SCREEN_HEIGHT){ 
			this.point['dy']*=-1;
			this.point['y'] = SCREEN_HEIGHT;
		}

		var width = 1000, 
			height = 800, 
        x = this.point['x'], 
        y = this.point['y'],
        rx = SCREEN_WIDTH * x / width,
        ry = SCREEN_HEIGHT * y / height;
        
	    var xc = ~~(256 * x / width);
	    var yc = ~~(256 * y / height);

	    grad = renderer.createRadialGradient(rx, ry, 0, rx, ry, 600); 
	    grad.addColorStop(0, '#000');
	    grad.addColorStop(1, ['rgb(', xc, ', ', (255 - xc), ', ', yc, ')'].join(''));
	    
		renderer.fillStyle = grad;
		renderer.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
		

		// Draw borders level
		renderer.fillStyle = "rgba(0, 0, 0, 0.6)";
		renderer.fillRect(view.x,view.y,this.width,this.height);
		renderer.strokeStyle = "silver"
		renderer.strokeRect(view.x,view.y,this.width,this.height);
		

	},

}/**
* UI - Classes
* 
* User Interface Elements:
* - "What's the next piece" box 
* - Score counter
* - Button (menu etc...)
* - Ambient text (customizable)
**/


/** 
* UI_NextPIece 
**/

function UI_NextPiece(x,y){
	// Screen disposition
	this.pos_x = x;
	this.pos_y = y;
	// Piece to display
	this.piece_pattern_id = -1;
	this.piece = null;
	this.is_mutated = false;
}

UI_NextPiece.prototype = {

	setNextPiece:function(piece_pattern_id,piece){
		this.piece_pattern_id = piece_pattern_id;
		this.piece = piece;
		this.is_mutated = false;
	},

	// A piece can be 5*5 blocks
	render:function(renderer){
		// Draw frame
		renderer.fillStyle="rgba(0, 0, 0, 0.6)";
		renderer.fillRect(this.pos_x,this.pos_y,UNIT_WIDTH*5+4,UNIT_HEIGHT*5+4);
		renderer.strokeStyle="silver";
		renderer.strokeRect(this.pos_x,this.pos_y,UNIT_WIDTH*5+4,UNIT_HEIGHT*5+4);
		// Draw block pattern
		this.piece.render(renderer,{'x':this.pos_x+UNIT_WIDTH*(2-this.piece.in_x),'y':this.pos_y+UNIT_HEIGHT*(2-this.piece.in_y)});
		if(this.is_mutated){
			renderer.fillStyle="#fff";
			renderer.textAlign = "Center";
			renderer.font = "bold 100px Arial";
			// . Realtime FPS
			renderer.fillText("?", this.pos_x+UNIT_WIDTH*2,this.pos_y+UNIT_HEIGHT*2);
		}
	},

}

/** 
* UI_ScoreCounter
**/

function UI_ScoreCounter(x,y){
	// Screen disposition
	this.pos_x = x;
	this.pos_y = y;
	// Internal data
	this.score = 0;
	this.displayed_score = 0;
}

UI_ScoreCounter.prototype = {

	addValue:function(value){
		this.score += value;
	},

	addValueRealtime:function(value){
		this.score += value;
		this.displayed_score += value;
	},

	// Increase displayed score value if needed
	update:function(){
		if(this.displayed_score < this.score)
		{
			var factor = Math.floor((this.score-this.displayed_score)/10);
			if(factor < 1)
				factor = 1;
			this.displayed_score+=factor;
		}
		else
			this.displayed_score = this.score;
	},

	render:function(renderer){
		renderer.fillStyle="#fff";
		renderer.textAlign = "Left";
		renderer.font = "bold 30px Verdana";
		renderer.fillText("Score", this.pos_x,this.pos_y);
		renderer.fillText(this.displayed_score, this.pos_x,this.pos_y+1.5*UNIT_HEIGHT);
	},

}


/** 
* UI_LineCounter
**/

function UI_LineCounter(x,y){
	// Screen disposition
	this.pos_x = x;
	this.pos_y = y;
	// Internal data
	this.counter = 0;
}

UI_LineCounter.prototype = {

	addValue:function(value){
		this.counter += value;
	},

	render:function(renderer){
		renderer.fillStyle="#fff";
		renderer.textAlign = "Left";
		renderer.font = "bold 30px Verdana";
		renderer.fillText("Lines", this.pos_x,this.pos_y);
		renderer.fillText(this.counter, this.pos_x,this.pos_y+1.5*UNIT_HEIGHT);
	},

}
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

}/**
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
	
	
	
}/**
* Game.js
**/

function Game() {

	var self = this;

	// Save canvas reference
	this.surface = document.getElementById("game");
	this.surface.innerHTML = "";
	this.surface.width = SCREEN_WIDTH;
	this.surface.height = SCREEN_HEIGHT;
	this.renderer = this.surface.getContext("2d");

	// Resources
	this.resource_manager = new ResourceManager;

	// Game current state
	this.is_running = false;
	this.current_level = null;

	// External events
	// . Keyboard tracking
	this.keyboard = {
		'status':{},
		onKeydown:function(event){
			event.preventDefault();
			this.status[event.keyCode]=true;
		},
		onKeyup:function(event){
			delete this.status[event.keyCode];
		},
	};
	window.addEventListener('keydown', function(event) { self.keyboard.onKeydown(event); }, false);
	window.addEventListener('keyup', function(event) { self.keyboard.onKeyup(event); }, false);

	// . Mouse tracking
	/*
	game.mouse = {'x':0,'y':0};
	game.canvas_tag.onmousemove = function(e){
		game.mouse.x = e.clientX - game.canvas_tag.offsetLeft;
		game.mouse.y = e.clientY - game.canvas_tag.offsetTop;
	};
	*/

	// default control hack (will disable keyboard scrolling)
	window.addEventListener('keydown',function(event) { event.preventDefault(); },false);
	// Auto focus
	window.onload = document.getElementById('game').focus();
	

	// Debug
	this.frame_count = 0;
	this.last_computed_FPS_time = E_TimeNow() - 1000;
	this.realtime_FPS = 0;
}

Game.prototype = {

	load: function(file_list,callback_function){
		// Load once
		if(!this.resource_manager.ready)
			this.resource_manager.loadFiles(file_list,callback_function);
	},

	init: function() {
		this.is_running = true;
		// Initial default Level
		this.current_level = new Level(this);
	},

	update: function(){

		// Restart
		if(this.keyboard.status[KEY_RESTART])
			this.current_level = new Level(this);

		// Gameover?
		if(this.current_level.is_finished)
			return;

		// Do stuff...
		this.current_level.update(this.keyboard.status);
	},


	render: function() {

		// Gameover?
		if(this.current_level.is_finished)
			return;

		// Clean screen
		this.renderer.clearRect(0, 0, this.surface.width, this.surface.height);

		// Do stuff...
		this.current_level.render(); 
	},

	debugLog: function() {

		// FrameCount
		this.frame_count++;
		var current_time = E_TimeNow();
		if( current_time - this.last_computed_FPS_time >= 1000){
			this.last_computed_FPS_time = current_time;
			this.realtime_FPS = this.frame_count;
			this.frame_count = 0;
		}

	},

}/**
*	Main.js
*	Test code content.
**/

document.addEventListener("DOMContentLoaded", init, false);

// global scope
var game = null;

function init() {

	Debug("Main > DOMContentLoaded.");
	
	var resources = {
		'tex':[
			//'eye_1.png','eye_2.png','eye_3.png',
			'block_blue.png','block_green.png','block_red.png',
		],
		'sound':[
			'block','switch','bonus','tetris','level',
		],
		'music':[
			'music1','music2','music3','music4',
		],
	}

	game = new Game();
	game.load(resources,onGameLoaded);
}

/** This function is called back by the loader when terminating */
function onGameLoaded() {
	Debug("Main > All game resources loaded, starting game main loop.");
	game.init();
	runGame();
}

/**
* This function is supposed to be called every 16ms (60 PFS) via requestAnimFrame. 
* (see script/Common.js to learn more)
* The game main loop is classicaly composed of the update() and render() functions call.
*/
function runGame() {

	// Main loop
	game.update();
	game.render();
	
	// Display debug log on top
	if(DEBUG)
		game.debugLog();

	// Assure the 60 FPS rate
	requestAnimFrame(runGame);
}