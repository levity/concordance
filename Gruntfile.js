module.exports = function(grunt) {

  grunt.registerTask('watch', ['watch']);

  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'public/index.css': 'app/index.scss'
        }
      }
    },
    browserify: {
      dist: {
        options: {
          transform: ['debowerify']
        },
        files: {
          'public/index.js': ['app/index.js']
        }
      }
    },
    copy: {
      index: {
        files: [
          {src: 'app/index.html', dest: 'public/index.html'}
        ]
      }
    },
    watch: {
      js: {
        files: ['app/index.js'],
        tasks: ['browserify:dist'],
        options: {
          spawn: false
        }
      },
      css: {
        files: ['app/index.scss'],
        tasks: ['sass:dist']
      },
      html: {
        files: ['app/index.html'],
        tasks: ['copy:index']
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

};
