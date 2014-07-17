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
		'load-image-min': '../libs/load-image.min',
		'load-image': '../libs/load-image',
		'load-image-ios': '../libs/load-image-ios',
		'load-image-orientation': '../libs/load-image-orientation',
		'load-image-meta': '../libs/load-image-meta',
		'load-image-exif': '../libs/load-image-exif',
		'load-image-exif-map': '../libs/load-image-exif-map'
	},
	shim: {
		d3: {
			exports: 'd3'
		}
	}
});

require(['vibe']);
