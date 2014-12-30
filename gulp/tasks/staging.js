var gulp = require('gulp')
var runSeq = require('run-sequence').use(gulp)

gulp.task('staging',  function(){
  runSeq('config', 'build');
})
