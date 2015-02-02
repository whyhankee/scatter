/* jshint node: true */
"use strict";

var gulp = require('gulp'),
    riot = require('gulp-riot');

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
        .pipe(gulp.dest(staticRoot+'js'));
});

// Gulp tasks
//
gulp.task('default', function() {
  gulp
    .src(cssSrc)
    .pipe(gulp.dest(staticRoot+'css'));
  gulp
    .src(jsSrc)
    .pipe(gulp.dest(staticRoot+'js'));
});
