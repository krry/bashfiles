/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  PROD
  root task

  like STAGING, only more buttoned up
  run on the heroku production instance

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var runSeq = require('run-sequence').use(gulp);

gulp.task('heroku:prod', function() {
  runSeq('config', 'build');
});
