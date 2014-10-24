var gulp = require('gulp')
var runSeq = require('run-sequence').use(gulp)

gulp.task('default',  function(){
	runSeq('build', 'watch', 'browserSync');
})
