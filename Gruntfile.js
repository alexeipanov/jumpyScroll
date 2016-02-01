module.exports = function(grunt) {

    require('time-grunt')(grunt);

    grunt.initConfig({

        // uglify: {
        //     dist: {
        //         src: '<%= concat.dist.dest %>',
        //         dest: 'dist/jquery.<%= pkg.name %>.min.js'
        //     },
        // },

        jshint: {
            options: {
                jshintrc: true
            },
            src: {
                src: ['src/**/*.js']
            },
        },

        watch: {
            livereload: {
                options: {
                    livereload: true
                },
                files: ['src/assets/jquery.jumpyScroll.js'],
            },

        },


    });

    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-reload');

    grunt.registerTask('default', [
        'watch',
        'jshint'
        // 'uglify'
    ]);

};
