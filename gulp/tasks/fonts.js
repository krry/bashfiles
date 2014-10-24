var gulp = require('gulp')
var changed = require('gulp-changed')

var handleErrors = require('../util/handleErrors')

var fontSrc = [
  './src/fonts/*'
]

var publicfont = './public/fonts/'

gulp.task('fonts', function(){
  return gulp.src(fontSrc)
        .pipe(changed(publicfont))
        .on('error', handleErrors)
        .pipe(gulp.dest(publicfont))
})

