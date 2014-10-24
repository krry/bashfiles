var gulp = require('gulp')
var runSeq = require('run-sequence').use(gulp)

gulp.task('default', ['clean', 'build', 'browserSync'], function(){

})
