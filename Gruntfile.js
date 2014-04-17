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
			main: {
				files: {
					'css/all.css': [
						'bower_components/bootstrap/less/bootstrap.less',
						'less/all.less'
					]
				}
			}
		},
		watch: {
			css: {
				files: ['less/**'],
				tasks: 'less'
			},
			js: {
				files: ['js/src/**'],
				tasks: ['copy', 'transpile']
			}
		}
	});

	grunt.registerTask('default', ['copy', 'transpile', 'less']);
};
