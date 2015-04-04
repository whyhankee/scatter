/* jshint node: true */
"use strict";

var gulp             = require('gulp'),
    riot             = require('gulp-riot'),
    compass          = require('gulp-compass'),
    autoprefixer     = require('gulp-autoprefixer'),
    minifycss        = require('gulp-minify-css'),
    uglify           = require('gulp-uglify'),
    rename           = require('gulp-rename'),
    concat           = require('gulp-concat'),
    notify           = require('gulp-notify'),
    plumber          = require('gulp-plumber'),
    imagemin         = require('gulp-imagemin'),
    cache            = require('gulp-cache'),
    browserSync      = require('browser-sync'),
    reload           = browserSync.reload,
    path             = require('path');


//error notification settings for plumber
var plumberErrorHandler = { errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }
};

// BrowserSync
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./web/",
            index: "/static/index.html",
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', ':2460');
                next();
            }
        },
        socket: {
            path: "/socket.io",
            clientPath: "",
            namespace: "/"
        }
    });
});


// Copy files task
//
var cssSrc = [
    'bower_components/skeleton/css/*.css'
    ],
    jsSrc  = [
        'bower_components/riotjs/riot.min.js',
        'bower_components/node-uuid/uuid.js'
    ],
    staticRoot = './web/static/';

gulp.task('riot', function() {
    gulp
        .src('web/src/tag/*.tag')
        .pipe(riot())
        .pipe(gulp.dest(staticRoot+'js'))
        .pipe(reload({stream:true}));
});

//styles
gulp.task('styles', function() {
    return gulp.src('web/src/sass/*.scss')
        .pipe(plumber(plumberErrorHandler))
        .pipe(compass({
            config_file: 'web/config.rb',
            css: 'web/static/css',
            sass: 'web/src/sass',
            image: 'web/static/img'
        }))
        .on('error', function(err) {
            // Would like to catch the error here
            console.log(err);
        })
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('web/static/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('web/static/css'))
        .pipe(reload({stream:true}));
});

//scripts
gulp.task('scripts', function() {
    return gulp.src('web/src/js/*.js')
        .pipe(plumber(plumberErrorHandler))
        .pipe(concat('scatter.js'))
        .pipe(gulp.dest('web/static/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('web/static/js'))
        .pipe(reload({stream:true}));
});

// Images
gulp.task('images', function() {
  return gulp.src('web/src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('web/static/img'))
    .pipe(reload({stream:true}));
});

// Default task
gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'images');
});

// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// Gulp tasks
gulp.task('copy', function() {
  gulp
    .src(cssSrc)
    .pipe(gulp.dest(staticRoot+'css'));
  gulp
    .src(jsSrc)
    .pipe(gulp.dest(staticRoot+'js'));
});

//watch
gulp.task('live',  ['browser-sync'], function() {
    // Watch .scss files
    gulp.watch('./web/src/sass/*.scss', ['styles']);
    // Watch .js files
    gulp.watch('./web/src/js/*.js', ['scripts']);
    // Watch image files
    gulp.watch('./web/src/img/**/*', ['images']);
    // Watch index files
    gulp.watch('./web/index.html', ['bs-reload']);
    // Watch .tag files
    gulp.watch('./web/src/tag/*.tag', ['riot']);
});

