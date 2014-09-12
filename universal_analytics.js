//google documentation - https://developers.google.com/analytics/devguides/collection/analyticsjs/

//create console object if non-existent
if(typeof console=='undefined'){ window.console={ log:function(){}}; }

//load universal analytics library
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

//analytics object deifintion
var _analytics = {
	//page vars
	ua:		{ test:{'UA-0000000-0':'test'} },
	path:		window.location.pathname,
	host:		window.location.host,
	pound:		window.location.hash,
	query:		window.location.search,
	debug:		/([\?|&|#]debug)/.test(window.location.search) ? true : false,
	page:		/\/([\w-\.]+)$/.test(window.location.pathname) ? 
				window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1) : false,
	title: 		document.title,
	
	//initialize analtics, args: 
	//		[inbound]	(object) 	required	analytic accounts		
	//		[param]		(options)	optional	page_view (pageview), display_features (display features)
	init: function(inbound,param){
		var param = (typeof param=='undefined' || typeof param!='object') ? false : param;

		if(this.debug) console.log('function: init()');
		if(typeof inbound!='object') return false;
		else this.ua.live = inbound; 
		
		//override ua object to actual outbound
		this.ua = (this.debug) ? this.ua.test : this.ua.live;

		//universal analytics creation every item in outbound object
		for(var ua in this.ua){
			this.ua[ua] = this.ua[ua].replace(/\./gi,'');
			ga('create', ua, {'name':this.ua[ua]});
			if(this.debug) console.log('\tcreate: '+ua+' => '+this.ua[ua]);
		}

		//additional options
		if(param){
			//display features
			if(typeof param.display_features!='undefined' && param.display_features) this.display_features();

			//track pageview if argument is undefined or true
			if(typeof param.page_view=='undefined' || param.page_view==true) this.page_view();

		} else this.page_view();
	},

	//enable display features
	display_features: function(){
		for(var ua in this.ua) ga(this.ua[ua]+'.require','displayfeatures');
	},

	//send pageview for outbound
	page_view: function(pv_page,pv_title){
		pv_page = (typeof pv_page=='undefined') ? this.path : pv_page;
		pv_title = (typeof pv_title=='undefined') ? this.title : pv_title;

		if(this.debug) console.log('function: page_view()');
		for(var ua in this.ua){
			ga(this.ua[ua]+'.send', 'pageview', {
				'page': pv_page,
				'title': pv_title
			});

			if(this.debug) console.log('\tpageview: '+ua+' => '+this.ua[ua]);
		}
	},

	//send event for outbound, args:
	//		[category]	(string)	required	typically the object that was interacted with (e.g. button)
	//		[action]	(string)	required	type of interaction (e.g. click)
	//		[label]		(string)	optional	useful for categorizing events (e.g. nav buttons)
	//		[value]		(integer)	optional	values must be non-negative, useful to pass counts
	page_event: function(category, action, label, value){
		if(this.debug) console.log('function: page_event(category, action, label, value)');
		if(typeof category=='undefined'||typeof action=='undefined') return false;
		var label = (typeof label=='undefined') ? null : label,
			value = (typeof value=='undefined') ? null : value;

		for(var ua in this.ua){
			ga(this.ua[ua]+'.send', 'event', category, action, label, value);
			if(this.debug) console.log('\tevent: '+ua+' => {'+category+','+action+','+label+','+value+'}');
		}
	}
};
