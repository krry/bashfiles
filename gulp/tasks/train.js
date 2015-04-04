/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  TRAIN
  root task

  a simplified build process for the training environment

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var runSeq = require('run-sequence').use(gulp);
var build = require('./build');

gulp.task('heroku:train', function() {
  return runSeq('config', 'templates', build, 'indexFile');
});
