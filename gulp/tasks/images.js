var gulp = require('gulp')
var changed = require('gulp-changed')

var handleErrors = require('../util/handleErrors')

var imgSrc = [
  './src/img/**/*'
]

var imgPub = './public/img/'

gulp.task('images', function(){
  return gulp.src(imgSrc)
        .pipe(changed(imgPub))
        .on('error', handleErrors)
        .pipe(gulp.dest(imgPub))
})

