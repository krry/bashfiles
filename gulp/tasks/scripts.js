var gulp = require('gulp');
var concat = require('gulp-concat');

var scripts = [
  'src/js/*.js',
  'src/js/states/*.js',
  'src/js/services/*.js',
  'src/js/controllers/*.js',
  'src/js/directives/*.js',
]

gulp.task('scripts', function(stuff){
  return gulp.src(scripts)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./public/js'))
})
