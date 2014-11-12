# universal analytics
this script allows for multiple google analytics accounts to be set up and controlled as a package. so if a custom event is triggered, it will send to all ua numbers that the analytics object has been configured with. it simplifies demographics, custom page views, and custom events and has some test/debug options to see the data that would be sent to ga without actually sending.

## loading the analytics script
    <script type="text/javascript" charset="utf-8" src="/path/to/universal_analytics.js"></script>

## configuration
> configure ua accounts in a diff script/in the html body
> #### usage
> + test/debug ua        
        _analytics.ua.test = { 'UA-0000-3':'global' };
+ live ua
       _analytics.init({ 'UA-0000-1':'global', 'UA-0000-2':'subdomain' });

## init options
> + page_view: send ga page view on init [boolean]
+ display_features: enable ga demographics [boolean]

> #### usage
    _analytics.init(
        { 'UA-0000-1':'global', 'UA-0000-2':'subdomain'},
        { page_view:true, display_features:false }
    );

### debugging
display what would be sent to ga in the console without sending data to your actual account(s), disabed by default
#### usage
* javascript: `_analytics.ua.debug = true;`
* append **?debug** / **&debug** or **#debug** to end of the url

## functions
> ### page_view
> can be called at any time, example uses for calling after main page view would be for things like tracking pushstate / ajax content switches
> #### arguments
+ pv_page
    + description: page path
    + type: string 
    + optional
    + default: current path
+ pv_title
    + description: page title
    + type: string 
    + optional
    + default: current title
> #### example
    _analytics.page_view('/page_name','Some Page Title');


> ### page_event
> track a custom event
> #### arguments
+ category
    + description: typically the object that was interacted with (e.g. button)
    + type: string
    + required
+ action
    + description: type of interaction (e.g. click)
    + type: string
    + required
+ label
    + description: useful for categorizing events (e.g. nav buttons)
    + type: string
    + optional
+ value
    + description: values must be non-negative, useful to pass counts
    + type: integer
    + optional
> #### example with jquery listner
    $(document).on('click','.button',function(){
        _analytics.page_event('global button','click',$(this).text());
    });


