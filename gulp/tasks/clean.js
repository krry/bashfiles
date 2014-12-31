var gulp  = require('gulp')
var del = require('del')

var laundry = [
  './src/js/config.js',
  './public/js/**/*',
  './public/templates/**/*',
  './public/css/**/*',
  './public/img/*',
  './public/lib/*',
  './public/fonts/*',
  './public/index.html',
]

gulp.task('clean', function() {
  console.log('[clean] now cleaning dist folders');
  return del(laundry);
})
