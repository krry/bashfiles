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
];

gulp.task('clean', function() {
  console.log('[clean   ] now cleaning dist folders');
  return del(laundry);
});
