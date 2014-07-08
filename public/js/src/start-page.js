require.config({
	baseUrl: '/js/build',
	paths: {
		text: '../libs/text',
		jquery: '../libs/jquery',
		underscore: '../libs/underscore',
		backbone: '../libs/backbone',
		d3: '../libs/d3',
		moment: '../libs/moment',
		autosize: '../libs/jquery.autosize',
		faye: '../libs/faye-browser'
	},
	shim: {
		d3: {
			exports: 'd3'
		}
	}
});

require([
	'pages/admin_invite_company',
	'pages/forgot_password',
	'pages/login',
	'pages/splash',
	'pages/register',
	'pages/register_from_invite',
	'pages/reset_password'
]);
