var gulp = require('gulp')
var gulp = require('gulp')
var runSeq = require('run-sequence')

gulp.task('rebuild', function(){
  runSeq('clean', 'meta')
})
