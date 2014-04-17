require.config({
	baseUrl: 'js/build',
	paths: {
		text: '../libs/text',
		jquery: '../libs/jquery',
		underscore: '../libs/underscore',
		backbone: '../libs/backbone'
	}
});

require(['vibe']);
