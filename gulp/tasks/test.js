/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  TEST
  root task

  a simplified build process for the test server
  run with `npm run test` --- see `package.json`

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var runSeq = require('run-sequence').use(gulp);
var build = require('./build');

gulp.task('heroku:test', function() {
  runSeq('config', build);
});
