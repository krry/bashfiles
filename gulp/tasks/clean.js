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
  './src/js/templates-*.js',
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
var fonts = './public/fonts/**/*.*';
var images = './public/img/*';
var libs = './public/lib/libs-*';

gulp.task('clean', function() {
  console.log('[clean   ] now cleaning dist folders');
  if (laundry) return del(laundry);
});

gulp.task('clearTemplates', function () {
  if (templates) return del(templates);
});

gulp.task('clearScripts', function () {
  if (scripts) return del(scripts);
});

gulp.task('clearStyles', function () {
  if (styles) return del(styles);
});

gulp.task('clearLibs', function () {
  if (libs) return del(libs);
});

gulp.task('clearFonts', function () {
  if (fonts) return del(fonts);
});

gulp.task('clearImages', function () {
  if (images) return del(images);
});
