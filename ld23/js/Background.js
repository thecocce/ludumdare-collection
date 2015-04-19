function Background(){
	
	this.first_plan={
		'tex':tex_background_1,
		'x':0,'y':0,
		'speed':2,
	};
	
	this.sec_plan={
		'tex':tex_background_2,
		'x':0,'y':0,
		'speed':1,
	};
	
	this.cloud_tex=[tex_cloud_1,tex_cloud_2,tex_cloud_3,tex_cloud_4,tex_cloud_5,tex_cloud_6,tex_cloud_7];
	this.cloud_1 = {'tex':this.cloud_tex[Math.floor((Math.random()*7))],'x':screen_width, 'y':Math.floor((Math.random()*80))};
	this.cloud_2 = {'tex':this.cloud_tex[Math.floor((Math.random()*7))],'x':screen_width-300, 'y':Math.floor((Math.random()*80))};
	this.cloud_3 = {'tex':this.cloud_tex[Math.floor((Math.random()*7))],'x':screen_width-600, 'y':Math.floor((Math.random()*80))};
	
}


Background.prototype = {
	
	update:function(){
		// Move each plans
		if(this.first_plan.x<this.first_plan.tex.width-screen_width-this.first_plan.speed)
			this.first_plan.x+=this.first_plan.speed;
		else
			this.first_plan.x=0;
				
		if(this.sec_plan.x<this.sec_plan.tex.width-screen_width-this.sec_plan.speed)
			this.sec_plan.x+=this.sec_plan.speed;
		else
			this.sec_plan.x=0; // FIXME BITCH
		
		// Move clouds
		if(--this.cloud_1.x<=-this.cloud_1.tex.width)
			this.cloud_1 = {'tex':this.cloud_tex[Math.floor((Math.random()*7))],'x':screen_width+100, 'y':Math.floor((Math.random()*80))};
		if(--this.cloud_2.x<=-this.cloud_2.tex.width)
			this.cloud_2 = {'tex':this.cloud_tex[Math.floor((Math.random()*7))],'x':screen_width+100, 'y':Math.floor((Math.random()*80))};	
		if(--this.cloud_3.x<=-this.cloud_3.tex.width)
			this.cloud_3 = {'tex':this.cloud_tex[Math.floor((Math.random()*7))],'x':screen_width+100, 'y':Math.floor((Math.random()*80))};	
			
			
		// Others
		//if(this.tex_cloud_help.x>-this.tex_cloud_help.width){
		//	--this.tex_cloud_help.x;
		//}
		
	},
	
	draw:function(renderer){
		
		// Others
		//if(this.tex_cloud_help.dy>-this.tex_cloud_help.height){
		//	--this.tex_cloud_help.dy;
		//	--this.sec_plan.y;
		//	--this.first_plan.y;
		//	renderer.drawImage(this.tex_cloud_help,10,this.tex_cloud_help.dy);
		//}
		
		// Draw clouds
		renderer.drawImage(this.cloud_1.tex,this.cloud_1.x,this.cloud_1.y);
		renderer.drawImage(this.cloud_2.tex,this.cloud_2.x,this.cloud_2.y);
		renderer.drawImage(this.cloud_3.tex,this.cloud_3.x,this.cloud_3.y);
		
		
		// Draw each plan in reverse order
		renderer.drawImage(this.sec_plan.tex,
						this.sec_plan.x,this.sec_plan.y,
						screen_width,this.sec_plan.tex.height,
						0,screen_height-this.sec_plan.tex.height,
						screen_width,screen_height);
		
		renderer.drawImage(this.first_plan.tex,
						this.first_plan.x,this.first_plan.y,
						screen_width,this.first_plan.tex.height,
						0,screen_height-this.first_plan.tex.height,
						screen_width,screen_height);
		
	},
	
}