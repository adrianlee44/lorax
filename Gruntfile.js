module.exports = function(grunt) {
  grunt.initConfig({
    nodeunit: {
      files: ["test/**/*_test.js"]
    },
    eslint: {
      options: {
        configFile: 'eslint.json'
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
        files: "<%= eslint.gruntfile.files.src %>",
        tasks: ["eslint:gruntfile"]
      },
      src: {
        files: "<%= eslint.src.files.src %>",
        tasks: ["eslint:src", "nodeunit"]
      },
      test: {
        files: "<%= eslint.test.files.src %>",
        tasks: ["eslint:test", "nodeunit"]
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask("default", ["eslint", "nodeunit"]);
};
