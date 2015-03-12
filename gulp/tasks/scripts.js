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
var ngAnnotate = require('gulp-ng-annotate');

var handleErrors = require('../util/handleErrors');
var timestamp = require('../util/timestamp').timestamp;

// this glob determines the order of the concatenated scripts
var scriptSrc = [
  'src/js/*.js',
  'src/js/constants/**/*.js',
  'src/js/providers/**/*.js',
  'src/js/services/**/*.js',
  'src/js/controllers/**/*.js',
  'src/js/directives/**/*.js',
  'src/js/stages/**/*.js',
];

var scriptPub = './public/js';

gulp.task('scripts', ['clearScripts'], function(){
  var currentTime = timestamp();
  return gulp.src(scriptSrc)
    .pipe(plumber(handleErrors))
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(concat('all-' + currentTime + '.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest(scriptPub))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(plumber.stop())
    .pipe(gulp.dest(scriptPub))
});
