//google documentation - https://developers.google.com/analytics/devguides/collection/analyticsjs/

//create console object fallback if non-existent
(function(w,f,o,c,a){ if(!w[c]){ for(i=0;i<a.length;i++) o[a[i]]=f; w[c]=o; } })(window,function(){},{},'console',['warn','trace','timeEnd','time','profileEnd','profile','markTimeline','log','info','groupEnd','groupCollapsed','group','exception','error','dirxml','dir','debug','count','assert','clear','table','timeStamp']);

//load universal analytics library
if(typeof _uga==='undefined')
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','_uga');

//analytics object deifintion
var _analytics = {
	//page vars
	ua:		{ test:{ test:'UA-0000000-0' } },
	path:	window.location.pathname,
	host:	window.location.host,
	pound:	window.location.hash,
	query:	window.location.search,
	page:	/\/([\w-\.]+)$/.test(window.location.pathname) 
				? window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1) 
				: false,
	title: 		document.title,
	param: 	{ display_features:true, page_view:true },
	debug:	(/debug/gi.test(window.location.hash)) 
				? true
				: (/([\?|&|\#]debug)/.test(window.location.search) ? true : false),
	
	//initialize analtics, args: 
	//		[inbound]	(object) 	required	analytic accounts		
	//		[param]		(options)	optional	page_view (pageview), display_features (display features)
	init: function(inbound,param){
		if(typeof param!=='undefined' && typeof param=='object')
			for(var i in param) this.param[i] = param[i];

		if(this.debug) console.log('_analytics: init()');
		if(typeof inbound!='object') return false;
		else this.ua.live = inbound; 
		
		//override ua object to actual outbound
		this.ua = (this.debug) ? this.ua.test : this.ua.live;
		

		//universal analytics creation every item in outbound object
		for(var i in this.ua){

			if(typeof this.ua[i]!=='object')
				this.ua[i] = { id:this.ua[i], linker:false };
			
			if(this.ua[i].linker){
				_uga('create', this.ua[i].id, { name:i, allowLinker:true });
				_uga(i+'.require','linker');
				_uga(i+'.linker:autoLink', [this.ua[i].linker] );
			} else {
				_uga('create', this.ua[i].id, {'name':i });
			}
				

			if(this.debug) console.log('\tcreate: '+i+' => '+this.ua[i].id);
		}



		//display features if argument is undefined or true
		if(this.param.display_features==true) this.display_features();
			
		//track pageview if argument is undefined or true
		if(this.param.page_view==true) this.page_view();
	},

	//enable display features
	display_features: function(){
		for(var ua in this.ua) _uga(ua+'.require','displayfeatures');
	},

	//send pageview for outbound
	page_view: function(pv_page,pv_title){
		pv_page = (typeof pv_page=='undefined') ? this.path : pv_page;
		pv_title = (typeof pv_title=='undefined') ? this.title : pv_title;

		if(this.debug) console.log('_analytics: page_view()');
		for(var i in this.ua){
			_uga(i+'.send', 'pageview', {
				'page': pv_page,
				'title': pv_title
			});

			if(this.debug) console.log('\tpageview: '+i+' => '+this.ua[i].id);
		}
	},

	//send event for outbound, args:
	//		[category]	(string)	required	typically the object that was interacted with (e.g. button)
	//		[action]	(string)	required	type of interaction (e.g. click)
	//		[label]		(string)	optional	useful for categorizing events (e.g. nav buttons)
	//		[value]		(integer)	optional	values must be non-negative, useful to pass counts
	page_event: function(category, action, label, value){
		if(this.debug) console.log('_analytics: page_event(category, action, label, value)');
		if(typeof category=='undefined'||typeof action=='undefined') return false;
		var label = (typeof label=='undefined') ? null : label.replace(/[\?&]_ga=[\d\.]+/gi,''),
			value = (typeof value=='undefined') ? null : value;

		for(var i in this.ua){
			_uga(i+'.send', 'event', category, action, label, value);				
			
			if(this.debug) console.log('\tua:\t\t\t'+i+'\n\tcategory:\t'+category+'\n\taction:\t\t'+action+'\n\tlabel:\t\t'+label+'\n\tvalue:\t\t'+value);
		}
	}
};

var _anchor = {
	init: function(){
		var _this = this;

		if(_analytics.debug)
			console.log('_anchor:init()');

		//listen for new anchor elements
		try {
			this.listen();
			document.addEventListener('DOMNodeInserted',function(e){
				if(/^a$/i.test(e.target.nodeName)) _this.listen();
				return false;
			});
		} catch(error){
			console.log('insert listener error');
		};
	},

	listen: function(){
		var anchor = document.querySelectorAll('a');
		for(var i=0; i<anchor.length; i++){
			var item = anchor[i];
			item.addEventListener('click',this.track);
		}
	},

	track: function(e){
		if(_analytics.debug)
			e.preventDefault();

		var item = e.target, count=0;
		while(item.nodeName.toLowerCase()!='a'){
			if(count>10) break;
			item = item.parentNode;
			count++;
		}
				
		if(typeof item.getAttribute('href')!=='undefined' && item.getAttribute('href')!=null){
			if(_analytics.debug)
				console.log('_anchor:track()');

			var href = item.getAttribute('href').toLowerCase(),
				target = (item.getAttribute('target')!=='undefined' && /blank/gi.test(item.getAttribute('target'))) ? 1 : null,
				category = 'anchor link';

			//mail to
			if(/mailto/g.test(href))
				_analytics.page_event(category,'mailto',href.replace(/^mailto:/gi,''),target);
			
			//download
			else if(/\.(?:docx?|pptx?|xlsx?|avi|e(ps|xe)|gif|jpe?g|m(p[34]|ov|kv|4a)|p(df|ng)|rar|svg|txt|v(sd|xd)|wm[av]|zip)/.test(href)){
				if(!/^(http:|\/\/)/i.test(href)){
					if(!/^\//.test(href))
						href = _analytics.path.replace(_analytics.page,'')+href;
					href = _analytics.host+href;
				} else
					href = href.replace(/^https?:\/\//i,'');

				_analytics.page_event(category,'download',href,target);
			}

			//external
			else if(/(www|ftp|http(s)?:\/\/){1}[^'"\\]+/.test(href) && href.indexOf(_analytics.host)<0){
				href = href.replace(/^https?:\/\//i,'');
				_analytics.page_event(category,'external',href);
			}

			//hash
			else if(/#/g.test(href))
				_analytics.page_event(category,'hash',href);
		}
	}
};