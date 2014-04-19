define("vibe", 
  ["jquery","underscore","backbone","router","screenRouter","modelCache","models/user","views/AppView"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__) {
    "use strict";
    // Import libs
    var Router = __dependency4__["default"];
    var ScreenRouter = __dependency5__["default"];
    var ModelCache = __dependency6__["default"];
    var User = __dependency7__["default"];
    var AppView = __dependency8__["default"];

    window.Vibe = window.Vibe || {};

    $(function() {
    	// Load in data, such as user
    	window.Vibe.user = new User({
    		name: 'Zach Tratar',
    		img: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/t1.0-1/c0.0.160.160/p160x160/1920515_2252277543625_455505174_n.jpg',
    		email: 'ztratar@gmail.com',
    		company: {
    			name: 'Vibe',
    			domain: 'vibeapp.org',
    			size: 42
    		},
    		seenTutorial: false
    	});

    	// Set up the data cache
    	window.Vibe.modelCache = new ModelCache();

    	// Start the app visuals
    	window.Vibe.appView = new AppView();
    	window.Vibe.appView.render();

    	// inits window.Vibe.appRouter
    	Router.init();
    });
  });