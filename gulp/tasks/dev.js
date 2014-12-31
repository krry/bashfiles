/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  DEV
  root task

  cleans out the compiled files and makes sure that gulp
  is watching itself for changes as well

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var runSeq = require('run-sequence');

gulp.task('dev', function(){
  runSeq('clean', 'config', 'meta');
})
