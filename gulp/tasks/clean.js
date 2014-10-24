var gulp  = require('gulp')
var del = require('del')

var laundry = [
  './public/js/**/*',
  './public/templates/**/*',
  './public/css/**/*',
  './public/img/*',
  './public/fonts/*',
  './public/index.html',
]

gulp.task('clean', function() {
  console.log('now cleaning dist folders');
  return del(laundry);
})
