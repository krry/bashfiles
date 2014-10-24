var gulp  = require('gulp')
var clean = require('gulp-rimraf')

var laundry = [
  './public/js/*',
  './public/css/*',
  './public/img/*',
  './public/fonts/*',
]

gulp.task('clean', function() {
  console.log('now cleaning dist folders')
  return gulp.src(laundry, {read: false})
        .pipe(clean())
})
