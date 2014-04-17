module.exports = function(grunt) {

	// Getting Started:
	//
	// (1) NPM Install the required dependencies in the
	// package.json dir to ./node_modules
	// (2) Run 'grunt' in the command line to transpile JS

	// Load NPM Tasks
	grunt.loadNpmTasks('grunt-es6-module-transpiler');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				expand: true,
				cwd: 'src/templates/',
				src: '**',
				dest: 'build/templates/',
				filter: 'isFile'
			}
		},
		transpile: {
			main: {
				type: "amd", // or "amd" or "yui"
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.js'],
					dest: 'build/'
				}]
			}
		}
	});

	grunt.registerTask('default', ['copy', 'transpile']);
};
