var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var stylish = require('jshint-stylish');

var handleErrors = require('../util/handleErrors');

var scripts = [
  'src/js/*.js',
  'src/js/stages/*.js',
  'src/js/services/*.js',
  'src/js/controllers/*.js',
  'src/js/directives/**/*.js',
];

gulp.task('scripts', function(stuff){
  return gulp.src(scripts)
    .pipe(plumber(handleErrors))
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./public/js'))
});
