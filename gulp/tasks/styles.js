var gulp = require('gulp')
var changed = require('gulp-changed')

var handleErrors = require('../util/handleErrors')

var cssSrc = [
  './src/css/*'
]

var publicCss = './public/css/'

gulp.task('styles', function(){
  return gulp.src(cssSrc)
        .pipe(changed(publicCss))
        .on('error', handleErrors)
        .pipe(gulp.dest(publicCss))
})

