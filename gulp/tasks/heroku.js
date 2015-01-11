/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  HEROKU
  root task

  each heroku environment gets its own build task
  the build task name is specified in the custom BUILDPACK:
  https://github.com/krry/heroku-buildpack-nodejs-gulp

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var runSeq = require('run-sequence').use(gulp);

// without config.js
// gulp.task('heroku:production', ['build']);

// with config.js
gulp.task('heroku:production', function() {
  runSeq('config', 'build');
});
