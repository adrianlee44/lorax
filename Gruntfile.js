module.exports = function(grunt) {
  grunt.initConfig({
    nodeunit: {
      files: ["test/**/*_test.js"]
    },
    jshint: {
      options: {
        node: true
      },
      src: {
        files: {
          src: ["lib/*.js", "index.js"]
        }
      },
      test: {
        files: {
          src: ["test/**/*_test.js"]
        }
      },
      gruntfile: {
        files: {
          src: ["Gruntfile.js"]
        }
      }
    },
    watch: {
      gruntfile: {
        files: "<%= jshint.gruntfile.files.src %>",
        tasks: ["jshint:gruntfile"]
      },
      src: {
        files: "<%= jshint.src.files.src %>",
        tasks: ["jshint:src", "nodeunit"]
      },
      test: {
        files: "<%= jshint.test.files.src %>",
        tasks: ["jshint:test", "nodeunit"]
      }
    }
  });
  
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask("default", ["jshint", "nodeunit"]);
};
