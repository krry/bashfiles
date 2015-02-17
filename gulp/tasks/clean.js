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
  './public/index.html',
  './public/*.js'
];

var templates = './public/templates-*.js';
var scripts = './public/js/all-*.js';
var styles = './public/css/all-*.css';

gulp.task('clean', function() {
  console.log('[clean   ] now cleaning dist folders');
  return del(laundry);
});

gulp.task('clearTemplates', function () {
  return del(templates);
})

gulp.task('clearScripts', function () {
  return del(scripts);
})

gulp.task('clearStyles', function () {
  return del(styles);
})
