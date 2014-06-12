module.exports = function(grunt) {

    // Execution time of grunt tasks
    require('time-grunt')(grunt);

    // Load all tasks
    require('load-grunt-tasks')(grunt);

    // Variables for project
    var config = {

    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            files: 'css/_scss/**/*.scss',
            tasks: ['sass:dev']
        },
        sass: {
            options: {
                includePaths: [
                    require('node-bourbon').includePaths,
                    './bower_components/sass-list-maps',
                    './bower_components/foundation/scss'
                ]
            },
            dist: {
                option: {
                    outputStyle: 'compressed'
                },
                files: {
                    './css/screen.css': './css/_scss/screen.scss',
                    './css/screen-ie.css': './css/_scss/screen-ie.scss',
                    './css/print.css': './css/_scss/print.scss'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    './css/screen.css': './css/_scss/screen.scss',
                    './css/screen-ie.css': './css/_scss/screen-ie.scss',
                    './css/print.css': './css/_scss/print.scss'
                }
            }
        },
        browserSync: {
            dev: {
                files: {
                    src: 'css/screen.css'
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: '.'
                    }
                    /*,
                    host: 'katipultsandbox.dev.192.168.2.8',
                    proxy: 'katipultsandbox.dev:8888',
                    hostnameSuffix: ".xip.io"*/
                }
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('build', [
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin'
    ]);
};