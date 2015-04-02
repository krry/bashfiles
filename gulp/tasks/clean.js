/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  CLEAN
  supports CONFIG task

  cleans out previously compiled files prior to rebuilding
  the app

  useful in development and on remote servers as long as
  they run the proper build tasks afterwards

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp  = require('gulp');
var del = require('del');

var laundry = [
  './public/templates/**/*',
  './public/fonts/**/*',
  './public/img/**/*',
  './public/lib/**/*',
  './public/css/**/*',
  './public/js/**/*',
  './public/lib/**/*',
  './public/index.html',
  './public/*.js'
];

var templates = './src/js/templates-*.js';
var scripts = './public/js/all-*.js';
var styles = './public/css/all-*.css';
var fonts = './public/fonts/**/*';
var images = './public/img/*';
var libs = ['./public/lib/*.css', './public/lib/*.js'];

gulp.task('clean', function() {
  console.log('[clean   ] now cleaning dist folders');
  return del(laundry);
});

gulp.task('clearTemplates', function () {
  return del(templates);
});

gulp.task('clearScripts', function () {
  return del(scripts);
});

gulp.task('clearStyles', function () {
  return del(styles);
});

gulp.task('clearLibs', function () {
  return del(libs);
});

gulp.task('clearFonts', function () {
  return del(fonts);
});

gulp.task('clearImages', function () {
  return del(images);
});
