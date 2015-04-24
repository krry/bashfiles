/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  PROD
  root task

  like STAGING, only more buttoned up
  run on the heroku production instance

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var runSeq = require('run-sequence').use(gulp);
var build = require('./build');

gulp.task('heroku:prod', function() {
  return runSeq('config', 'fonts', 'templates', build, 'indexFile');
});
