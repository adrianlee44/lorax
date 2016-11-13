module.exports = function(grunt) {
  grunt.initConfig({
    ava: {
      options: {
        require: ['babel-register']
      },
      ci: {
        options: {
          nyc: true
        },
        files: {
          src: ['test/**/*_test.js']
        }
      },
      test: ['test/**/*_test.js']
    },
    eslint: {
      options: {
        configFile: 'eslint.json'
      },
      src: {
        files: {
          src: ['src/**/*.js']
        }
      },
      test: {
        files: {
          src: ['test/**/*_test.js']
        }
      },
      gruntfile: {
        files: {
          src: ['Gruntfile.js']
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= eslint.gruntfile.files.src %>',
        tasks: ['eslint:gruntfile']
      },
      src: {
        files: '<%= eslint.src.files.src %>',
        tasks: ['eslint:src', 'ava']
      },
      test: {
        files: '<%= eslint.test.files.src %>',
        tasks: ['eslint:test', 'ava']
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

  grunt.registerTask('default', ['eslint', 'ava']);
  grunt.registerTask('ci', ['eslint', 'ava:ci']);
};
