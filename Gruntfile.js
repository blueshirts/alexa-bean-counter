"use strict"

module.exports = function (grunt) {

  const jshintOptions = {
    jshintrc: true,
    globals: {
      jQuery: true
    }
  }

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'index.js', 'src/**/*.js', 'test/**/*.js'],
      options: jshintOptions
    },
    clean: {
      folder: ['./dist']
    },

  })

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-aws-lambda')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-sh');


  grunt.registerTask('default', ['jshint', 'lambda_package:beta', 'lambda_deploy:beta'])
  grunt.registerTask('beta', ['default'])
  grunt.registerTask('prod', ['jshint', 'lambda_package:prod', 'lambda_deploy:prod'])

}