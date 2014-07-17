require.config({
	baseUrl: '/js/build',
	paths: {
		modernizr: '../libs/modernizr',
		text: '../libs/text',
		jquery: '../libs/jquery',
		underscore: '../libs/underscore',
		backbone: '../libs/backbone',
		d3: '../libs/d3',
		moment: '../libs/moment',
		autosize: '../libs/jquery.autosize',
		faye: '../libs/faye-browser',
		hammer: '../libs/hammer',
		jqueryHammer: '../libs/jquery.hammer',
		exifRestorer: '../libs/exifrestorer'
	},
	shim: {
		d3: {
			exports: 'd3'
		}
	}
});

require(['vibe']);
