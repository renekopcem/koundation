module.exports = function(grunt) {

    // Execution time of grunt tasks
    require('time-grunt')(grunt);

    // Load all tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readJSON('config.json'),
        watch: {
            files: 'scss/**/*.scss',
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
                    './css/screen.css': './scss/screen.scss',
                    './css/screen-ie.css': './scss/screen-ie.scss',
                    './css/print.css': './scss/print.scss'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    './css/screen.css': './scss/screen.scss',
                    './css/screen-ie.css': './scss/screen-ie.scss',
                    './css/print.css': './scss/print.scss'
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
                        baseDir: '<%= config.browsersync.baseDir %>'
                    }/*
                    host: '<%= config.browsersync.host %>',
                    proxy: '<%= config.browsersync.proxy %>',
                    hostnameSuffix: '<%= config.browsersync.hostnameSuffix %>'
                    */
                }
            }
        },
        useminPrepare: {
            html: '../index.html',
            options: {
                root: '../',
                dest: './'
            }
        },
        usemin: {
            html: '../index.html'
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'css/i',                   // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'css/i'                  // Destination path prefix
                }]
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'js/*.js']
        },
        'sftp-deploy': {
            build: {
                //auth: {
                //    host: 'server.com',
                //    port: 22,
                //    authKey: 'key1'
                //},
                //src: '/path/to/source/folder',
                //dest: '/path/to/destination/folder',
                //exclusions: ['/path/to/source/folder/**/.DS_Store', '/path/to/source/folder/**/Thumbs.db', 'dist/tmp'],
                //server_sep: '/',
                //concurrency: 4,
                //progress: true
            }
        },
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'js/dist',
                        'css/dist'
                    ]
                }]
            }
        },
        copy: {
            cssimages: {
                cwd: 'css/i',
                src: '**',
                dest: 'css/dist/i/',
                expand: true
            },
            cssfonts: {
                cwd: 'css/f',
                src: '**',
                dest: 'css/dist/f/',
                expand: true
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        //'filerev',
        'usemin',
        'copy:cssimages',
        'copy:cssfonts'
    ]);
};