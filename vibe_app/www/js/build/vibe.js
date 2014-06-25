define("vibe", 
  ["jquery","underscore","backbone","faye","router","screenRouter","modelCache","models/user","views/AppView","views/loginView"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __dependency10__) {
    "use strict";
    // Import libs
    var Router = __dependency5__["default"];
    var ScreenRouter = __dependency6__["default"];
    var ModelCache = __dependency7__["default"];
    var User = __dependency8__["default"];
    var AppView = __dependency9__["default"];
    var LoginView = __dependency10__["default"];

    window.Vibe = window.Vibe || {};

    window.Vibe.run = function() {
    	// Initialize Faye for real-time pub sub
    	window.Vibe.faye = new Faye.Client(window.fayeServerRoute);

    	// Set up the data cache
    	window.Vibe.modelCache = new ModelCache();

    	var renderViews = function() {
    		// Start the app visuals
    		window.Vibe.appView = new AppView();
    		window.Vibe.appView.render();

    		window.Vibe.appView.run();

    		// inits window.Vibe.appRouter
    		Router.init();
    	};

    	// Load in data, such as user
    	if (window.isCordova) {
    		window.Vibe.user = new User();
    		window.Vibe.user.fetchCurrentUser(function() {
    			renderViews();
    		}, function() {
    			var loginView = new LoginView();
    			$('body').html(loginView.$el);
    			loginView.render();
    		});
    	} else {
    		window.Vibe.user = new User(window.Vibe._data_.currentUser);
    		renderViews();
    	}
    };

    window.Vibe.run();
  });