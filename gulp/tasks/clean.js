/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  CLEAN
  supports DEV, STAGING, and PROD tasks
  
  cleans out previously compiled files prior to rebuilding
  the app

  useful in development and on remote servers as long as 
  they run the proper build tasks afterwards

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp  = require('gulp')
var del = require('del')

var laundry = [
  './src/js/config.js',
  './public/index.html',
  './public/js/**/*',
  './public/templates/**/*',
  './public/css/**/*',
  './public/img/*',
  './public/lib/*',
  './public/fonts/*',
]

gulp.task('clean', function() {
  console.log('[clean] now cleaning dist folders');
  return del(laundry);
})
