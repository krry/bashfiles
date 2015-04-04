/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  TEMPLATEREBUILD
  supports watch task

  makes sure the templates rebuild and then the scripts
  recompile so they get served to the browser

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var runSeq = require('run-sequence').use(gulp);

gulp.task('template-rebuild', function (){
  return runSeq('templates', 'scripts');
})
