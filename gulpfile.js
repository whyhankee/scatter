/* jshint node: true */

var gulp        = require('gulp');

/**
 * Bower updates
 */
var cssSrc = [
  'bower_components/skeleton/css/*.css'
];
var jsSrc  = [
  'bower_components/riotjs/riot.min.js'
];
var staticRoot = './web/static/';



/**
 * Gulp tasks
 */
gulp.task('default', function() {
  gulp
    .src(cssSrc)
    .pipe(gulp.dest(staticRoot+'css'));
  gulp
    .src(jsSrc)
    .pipe(gulp.dest(staticRoot+'js'));
});
