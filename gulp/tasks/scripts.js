var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var scripts = [
  'src/js/*.js',
  'src/js/stages/*.js',
  'src/js/services/*.js',
  'src/js/controllers/*.js',
  'src/js/directives/**/*.js',
]

gulp.task('scripts', function(stuff){
  return gulp.src(scripts)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./public/js'))
})
