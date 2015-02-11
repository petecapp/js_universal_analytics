var _anchor = {
	init: function(){
		//listen for new anchor elements
		try {
			this.listen();
			document.addEventListener('DOMNodeInserted',function(e){
				if(/^a$/i.test(e.target.nodeName)) this.listen();
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

window.onload = function(){
	try {
		if(typeof _analytics!=='undefined' && typeof _anchor!=='undefined')
			_anchor.init();	
	} catch(error){
		console.log(error);
	};
};