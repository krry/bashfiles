var gulp = require('gulp');
// var changed = require('gulp-changed');

var templates = [
  'src/index.html',
  'src/templates/**',
]

gulp.task('templates', function(){

  return gulp.src(templates, {base: './src/'})
  	// .pipe(changed('./public/'))
    .pipe(gulp.dest('./public/'));
})
