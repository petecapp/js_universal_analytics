//assuming that universal_analytics.js has already been loaded

//configure test ua (optional)
_analtics.ua.test = {'UA-0000-3':'global'};

//initialize with live ua numbers
_analytics.init({'UA-0000-1':'global', 'UA-0000-2':'subdomain'});

//event tracking example with jquery listeners (jquery will need to be loaded)
$(document).ready(function(){
	//tracks rounded amount of seconds over advertisement banner or something
	var hover_start;
	$(document).on('mouseover mouseout','#main-advertisement img',function(e){
		if(e.type=='mouseover') hover_start = new Date();
		else {
			var seconds = Math.round((new Date()-hover_start)/1000);
			_analytics.page_event('image','hover','main advertisement',seconds);
		}
	});
});
