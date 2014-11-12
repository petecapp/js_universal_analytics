js_universal_analytics
======================

this script allows for multiple google analytics accounts to be set up and controlled as a package. so if a custom event is triggered, it will send to all ua numbers that the analytics object has been configured with. it simplifies demographics, custom page views, and custom events and has some test/debug options to see the data that would be sent to ga without actually sending.

load analytics script
    <script type="text/javascript" charset="utf-8" src="/path/to/universal_analytics.js"></script>

debugging
    disabed by default, display what would be sent to ga in the console without sending data to your actual account(s)
    
    usage:
        with javascript set _analytics.ua.debug = true;
        or add ?debug or #debug to end of the url
    
configure ua accounts in a diff script/in the html body
    test/debug ua:
        _analytics.ua.test = { 'UA-0000-3':'global' };

    live ua:
        _analytics.init({ 'UA-0000-1':'global', 'UA-0000-2':'subdomain' });

init options
    page_view: send ga page view on init [boolean]
    display_features: enable ga demographics [boolean]
    
    example:
        _analytics.init(
            { 'UA-0000-1':'global', 'UA-0000-2':'subdomain'},
            { page_view:true, display_features:false }
        );

functions
    page_view:
        arguments
            [pv_page]   (string)    optional    page path, defaults to current path
            [pv_title]  (string)    optional    page title, defaults to current title
            
        can be called at any time, example uses for calling after main page view would be for things like tracking pushstate / ajax content switches
        
        example:
            _analytics.page_view('/page_name','Some Page Title');

    page_event:
        arguments
            [category]	(string)	required	typically the object that was interacted with (e.g. button)
            [action]	(string)	required	type of interaction (e.g. click)
            [label]		(string)	optional	useful for categorizing events (e.g. nav buttons)
			[value]		(integer)	optional	values must be non-negative, useful to pass counts
        
        example (using jQuery listner):
            $(document).on('click','.button',function(){
                _analytics.page_event('global button','click',$(this).text());
            });




