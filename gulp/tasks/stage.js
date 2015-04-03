/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  STAGE
  root task

  a simplified build process for the staging server
  run with `npm run staging` --- see `package.json`

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var runSeq = require('run-sequence').use(gulp);
var build = require('./build');

gulp.task('heroku:stage', function() {
  runSeq('config', ['templates'], build, 'indexFile');
});
