module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			file: ['app.js', 'routes/apiRoutes.js', 'models/*.js', 'tests/*.js'],
		},
		watch: {
			files: ['app.js', 'routes/apiRoutes.js', 'models/*.js', 'tests/*.js'],
			tasks: ['jshint']
		}
	})

	grunt.loadNpmTasks('grunt-contrib-jshint')
	grunt.loadNpmTasks('grunt-contrib-watch')

	grunt.registerTask('default', ['watch'])

}
	