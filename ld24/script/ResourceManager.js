/**
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
