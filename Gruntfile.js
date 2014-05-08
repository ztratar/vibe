module.exports = function(grunt) {

	// -----------------------------------------------------------
	//
	// Getting Started:
	//
	// (1) NPM Install the required dependencies in the
	//     package.json dir to ./node_modules (npm install)
	//
	// (2) Install bower globally (npm install -g bower)
	//
	// (3) Install bootstrap (bower install bootstrap)
	//
	// (4) Run 'grunt' in the command line
	//
	// Note: js/libs should be symlinking to specific files
	//       in node_module directories
	//
	// -----------------------------------------------------------

	// Load NPM Tasks
	grunt.loadNpmTasks('grunt-es6-module-transpiler');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				expand: true,
				cwd: 'public/js/src/templates/',
				src: '**',
				dest: 'public/js/build/templates/',
				filter: 'isFile'
			},
			'ios7-font': {
				expand: true,
				cwd: 'public/less/icon-font/fonts/',
				src: '**',	
				dest: 'public/css/fonts/',
				filter: 'isFile'
			},
			'cordova-js-libs': {
				expand: true,
				cwd: 'public/js/libs/',
				src: '**',
				dest: 'vibe_app/www/js/libs',
				filter: 'isFile'
			},
			'cordova-js': {
				expand: true,
				cwd: 'public/js/build/',
				src: '**',
				dest: 'vibe_app/www/js/build/',
				filter: 'isFile'
			},
			'cordova-css': {
				expand: true,
				cwd: 'public/css/',
				src: '**',
				dest: 'vibe_app/www/css/',
				filter: 'isFile'
			},
			'cordova-img': {
				expand: true,
				cwd: 'public/img/',
				src: '**',
				dest: 'vibe_app/www/img/',
				filter: 'isFile'
			}
		},
		transpile: {
			main: {
				type: "amd", // or "amd" or "yui"
				files: [{
					expand: true,
					cwd: 'public/js/src/',
					src: ['**/*.js'],
					dest: 'public/js/build/'
				}]
			}
		},
		less: {
			main: {
				files: {
					'public/css/all.css': [
						'bower_components/bootstrap/less/bootstrap.less',
						'public/less/all.less'
					],
					'public/css/splash.css': [
						'bower_components/bootstrap/less/bootstrap.less',
						'public/less/splash.less'
					]
				}
			}
		},
		watch: {
			css: {
				files: ['public/less/**'],
				tasks: 'less'
			},
			js: {
				files: ['public/js/src/**'],
				tasks: ['copy', 'transpile']
			}
		}
	});

	grunt.registerTask('default', ['transpile', 'less', 'copy']);
};
