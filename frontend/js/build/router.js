define("router", 
  ["jquery","underscore","backbone","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";

    var Router = Backbone.Router.extend({
    	routes: {
    		'': 'index',
    		'/': 'index'
    	},
    	index: function() {

    	}
    });

    var initRouter = function() {
    	var appRouter = new Router();

    	Backbone.history.start({
    		pushState: true,
    		root: '/vibe'
    	});
    };

    __exports__["default"] = { init: initRouter };
  });