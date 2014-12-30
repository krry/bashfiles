var gulp = require('gulp')
var runSeq = require('run-sequence').use(gulp)

gulp.task('default',  function(){
	runSeq('config', 'build', 'watch', 'browserSync');
})
