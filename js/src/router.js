import 'jquery';
import 'underscore';
import 'backbone';

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

export default = { init: initRouter };
