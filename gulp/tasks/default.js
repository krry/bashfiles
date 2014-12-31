/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
   
  DEFAULT
  supports dev task

  runs when `gulp` is executed from root, 
  or it can be run explicitly like any other task

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp')
var runSeq = require('run-sequence').use(gulp)

gulp.task('default',  function(){
	runSeq('build', 'watch', 'browserSync');
})
