/* jshint node: true */
"use strict";
var gulp        = require('gulp');


// Copy files task
//
var cssSrc = [
  'bower_components/skeleton/css/*.css'
];
var jsSrc  = [
  'bower_components/riotjs/riot.min.js',
  'bower_components/node-uuid/uuid.js'
];
var staticRoot = './web/static/';



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
