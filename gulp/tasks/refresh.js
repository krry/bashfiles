var gulp = require('gulp')
var gulp = require('gulp')
var runSeq = require('run-sequence')

gulp.task('refresh', function(){
  runSeq('clean', 'reload')
})
