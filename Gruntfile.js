module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concurrent: {
			target: ["nodemon", "watch"],
			options: {
				logConcurrentOutput: true
			}
		},
		nodemon: {
			dev: {
				script: "./app.js"
			}
		},
		watch: {
			files: ["app.js", "routes/apiRoutes.js", "models/*.js", "tests/*.js"],
			tasks: ["jshint"]
		},
		jshint: {
			file: ["app.js", "routes/apiRoutes.js", "models/*.js", "tests/*.js"],
			options: {
				force: true
			}
		}
	});

	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-nodemon");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-jshint");

	grunt.registerTask("default", ["concurrent:target"]);

}
	