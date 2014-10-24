var gulp = require('gulp');
var changed = require('gulp-changed');
var concat = require('gulp-concat');

var scripts = [
  'src/templates/**/*.html',
]

gulp.task('templates', function(){
  gulp.src('src/index.html')
  	.pipe(changed('./public'))
  	.pipe(gulp.dest('./public'));
  return gulp.src(scripts)
  	.pipe(changed('./public/templates'))
    .pipe(gulp.dest('./public/templates'));
})
