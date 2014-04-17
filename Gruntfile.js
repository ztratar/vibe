module.exports = function(grunt) {

	// Getting Started:
	//
	// (1) NPM Install the required dependencies in the
	// package.json dir to ./node_modules
	// (2) Run 'grunt' in the command line to transpile JS

	// Load NPM Tasks
	grunt.loadNpmTasks('grunt-es6-module-transpiler');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				expand: true,
				cwd: 'js/src/templates/',
				src: '**',
				dest: 'js/build/templates/',
				filter: 'isFile'
			}
		},
		transpile: {
			main: {
				type: "amd", // or "amd" or "yui"
				files: [{
					expand: true,
					cwd: 'js/src/',
					src: ['**/*.js'],
					dest: 'js/build/'
				}]
			}
		},
		less: {
			development: {
				files: {
					'css/all.css': 'less/all.less'
				}
			},
			production: {
				files: {
					'css/all.css': 'less/all.less'
				}
			}
		}
	});

	grunt.registerTask('default', ['copy', 'transpile', 'less']);
};
