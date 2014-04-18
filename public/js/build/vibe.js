define("vibe", 
  ["jquery","underscore","backbone","router","screenRouter","models/user","views/AppView"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__) {
    "use strict";
    // Import libs
    var Router = __dependency4__["default"];
    var ScreenRouter = __dependency5__["default"];
    var User = __dependency6__["default"];
    var AppView = __dependency7__["default"];

    window.Vibe = window.Vibe || {};

    $(function() {
    	// Load in data, such as user
    	window.Vibe.user = new User({
    		name: 'Zach Tratar',
    		email: 'ztratar@gmail.com',
    		company: {
    			name: 'Y Combinator',
    			domain: 'ycombinator.com',
    			size: 42
    		},
    		seenTutorial: false
    	});

    	// Start the app visuals
    	window.Vibe.appView = new AppView();
    	window.Vibe.appView.render();

    	// inits window.Vibe.appRouter
    	Router.init();
    });
  });