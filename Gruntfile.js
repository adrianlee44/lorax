module.exports = function(grunt) {
  grunt.initConfig({
    ava: {
      target: ["test/**/*_test.js"],
      options: {
        nyc: true,
        require: [
          'babel-register'
        ]
      }
    },
    eslint: {
      options: {
        configFile: 'eslint.json'
      },
      src: {
        files: {
          src: ["src/**/*.js"]
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
        tasks: ["eslint:src", "ava"]
      },
      test: {
        files: "<%= eslint.test.files.src %>",
        tasks: ["eslint:test", "ava"]
      }
    },
    babel: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.js',
          dest: 'build'
        }]
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask("default", ["eslint", "test"]);
  grunt.registerTask("test", ["ava"])
};
