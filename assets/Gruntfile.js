module.exports = function(grunt) {

    // Execution time of grunt tasks
    require('time-grunt')(grunt);

    // Load all tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readJSON('config.json'),
        watch: {
            files: [
                '<%= config.scssPath %>/**/*.scss',
                '<%= config.cssSrcPath %>/**/*.css'
            ],
            tasks: ['sass:dev', 'postcss:dist', 'autoprefixer:dev']
        },
        browserify: {
            dev: {
                files: {
                    '<%= config.jsPath %>/app.js': ['<%= config.jsPath %>/src/main.js'],
                },
                options: {
                    watch : true, // use watchify for incremental builds!
                    //keepAlive : true, // watchify will exit unless task is kept alive
                    browserifyOptions: {
                        debug: true
                    },
                    transform: [['babelify', { "presets": ["es2015"] }]]
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            vendor: {
                src: [
                    // '<%= config.nodeModulesPath %>/foundation-sites/node_modules/jquery/dist/jquery.js',
                    // '<%= config.nodeModulesPath %>/foundation-sites/js/foundation.core.js',
                    // '<%= config.nodeModulesPath %>/foundation-sites/js/foundation.util.keyboard.js',
                    // '<%= config.nodeModulesPath %>/foundation-sites/js/foundation.util.motion.js',
                    // '<%= config.nodeModulesPath %>/foundation-sites/js/foundation.util.timerAndImageLoader.js',
                    // '<%= config.nodeModulesPath %>/foundation-sites/js/foundation.util.touch.js',
                    // '<%= config.nodeModulesPath %>/foundation-sites/js/foundation.orbit.js',
                    // Add other Foundation modules if needed
                ],
                dest: '<%= config.jsPath %>/vendor.js'
            },
            dist: {
                src: [
                    '<%= config.jsPath %>/vendor.js',
                    '<%= config.jsPath %>/app.js'
                ],
                dest: '<%= config.jsPath %>/dist/app.js'
            }
        },
        sass: {
            options: {
                includePaths: [
                    '<%= config.nodeModulesPath %>/foundation-sites/scss',
                    '<%= config.nodeModulesPath %>/motion-ui/src'
                ]
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    '<%= config.cssPath %>/vendor.css': '<%= config.scssPath %>/vendor.scss'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    '<%= config.cssPath %>/vendor.css': '<%= config.scssPath %>/vendor.scss'
                }
            }
        },
        postcss: {
            options: {
                map: {
                    inline: false,
                    annotation: '<%= config.cssPath %>/'
                },
                parser: require('postcss-scss'),
                processors: [
                    require('precss')(),
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            dist: {
                src: '<%= config.cssPath %>/src/screen.css',
                dest: '<%= config.cssPath %>/screen.css'
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
                        '<%= config.jsPath %>/app.js',
                        '../*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: '<%= config.browsersync.baseDir %>'
                    }
                    /*
                    host: '<%= config.browsersync.host %>',
                    proxy: '<%= config.browsersync.proxy %>',
                    hostnameSuffix: '<%= config.browsersync.hostnameSuffix %>'
                    */
                }
            }
        },
        useminPrepare: {
            html: '../index_dev.html',
            options: {
                root: '../',
                dest: '../'
            }
        },
        usemin: {
            html: '../index.html',
            options: {
                assetsDirs: ['../', 'css/dist']
            }
        },
        rev: {
            files: {
                src: [
                    '<%= config.cssPath %>/dist/**/*.css',
                    '<%= config.jsPath %>/dist/**/*.js'
                ]
            }
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
            html: {
                src: '../index_dev.html',
                dest: '../index.html'
            },
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
        },
        webfont: {
            icons: {
                src: 'css/i/ico/*.svg',
                dest: 'css/f/ico',
                destCss: 'scss/base',
                options: {
                    stylesheet: 'scss',
                    relativeFontPath: 'f/ico',
                    htmlDemo: false
                }
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['browserSync', 'browserify:dev', 'watch']);
    grunt.registerTask('build', [
        'clean:dist',
        'copy:html',
        'sass:dist',
        'autoprefixer:dist',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'copy:cssimages',
        'copy:cssfonts'
    ]);
};
