/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  SCRIPTS
  supports BUILD task
  
  lints the scripts with jsHint, outputs to the dev console
  concatenates all our `src/js`, uglifies it and produces
  a minified `all.min.js` and the debuggable `all.js`

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

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
  'src/js/services/*.js',
  'src/js/controllers/*.js',
  'src/js/directives/**/*.js',
  'src/js/rxjs-firebase/**/*.js',
  'src/js/stages/*.js',
];

gulp.task('scripts', function(){
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
