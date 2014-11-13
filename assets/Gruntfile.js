module.exports = function(grunt) {

    // Execution time of grunt tasks
    require('time-grunt')(grunt);

    // Load all tasks
    //require('load-grunt-tasks')(grunt);
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readJSON('config.json'),
        watch: {
            files: '<%= config.scssPath %>/**/*.scss',
            tasks: ['sass:dev', 'autoprefixer:dev']
        },
        sass: {
            options: {
                includePaths: [
                    require('node-bourbon').includePaths,
                    '<%= config.bowerComponentsPath %>/foundation/scss'
                ]
            },
            dist: {
                option: {
                    outputStyle: 'compressed'
                },
                files: {
                    '<%= config.cssPath %>/screen.css': '<%= config.scssPath %>/screen.scss',
                    '<%= config.cssPath %>/screen-ie.css': '<%= config.scssPath %>/screen-ie.scss',
                    '<%= config.cssPath %>/print.css': '<%= config.scssPath %>/print.scss'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    '<%= config.cssPath %>/screen.css': '<%= config.scssPath %>/screen.scss',
                    '<%= config.cssPath %>/screen-ie.css': '<%= config.scssPath %>/screen-ie.scss',
                    '<%= config.cssPath %>/print.css': '<%= config.scssPath %>/print.scss'
                }
            }
        },
        autoprefixer: {
            dev: {
                options: {
                    map: true
                },
                src: '<%= config.cssPath %>/screen.css'
            },
            dist: {
                src: '<%= config.cssPath %>/screen.css'
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        '<%= config.cssPath %>/screen.css',
                        '../*.html'
                    ]
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
            html: '../index.min.html'
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: '<%= config.cssPath %>/i',                   // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: '<%= config.cssPath %>/i'                  // Destination path prefix
                }]
            }
        },
        jshint: {
            all: ['Gruntfile.js', '<%= config.jsPath %>/*.js']
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
                        '<%= config.jsPath %>/dist',
                        '<%= config.cssPath %>/dist'
                    ]
                }]
            }
        },
        copy: {
            cssimages: {
                cwd: '<%= config.cssPath %>/i',
                src: '**',
                dest: '<%= config.cssPath %>/dist/i/',
                expand: true
            },
            cssfonts: {
                cwd: '<%= config.cssPath %>/f',
                src: '**',
                dest: '<%= config.cssPath %>/dist/f/',
                expand: true
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('build', [
        'clean:dist',
        'sass:dist',
        'autoprefixer:dist',
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
