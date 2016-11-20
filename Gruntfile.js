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

  grunt.registerTask('default', ['eslint', 'ava:test']);
  grunt.registerTask('ci', ['eslint', 'ava:ci']);
  grunt.registerTask('build', ['babel']);
};
