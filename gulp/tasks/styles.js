/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  STYLES
  supports BUILD task

  compiles `.scss` to `.css`
  auto-prefixes the CSS rules with vendor prefixes
  concatenates the stylesheets into one file
  creates a minified `all.min.css` as well

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp    = require('gulp');
var concat  = require('gulp-concat');
var rename  = require('gulp-rename');
var prefix  = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sass    = require('gulp-sass');
var minCss  = require('gulp-minify-css');

var timestamp = require('../util/timestamp').timestamp;
var handleErrors = require('../util/handleErrors');

// this glob determines the order of the concatenated stylesheets
var styleSrc = [
  './src/lib/normalize.css/normalize.css',
  './src/css/defaults/*.scss',
  './src/css/utilities/*.scss',
  './src/css/patterns/*.scss',
  './src/css/fln/*.scss',
  './src/css/**/*.css',
];

var sassOpts = {
  sourceComments: 'normal'
};

var stylePub = './public/css';

gulp.task('styles', ['clearStyles'], function(){
  return gulp.src(styleSrc)
        .pipe(plumber(handleErrors))
        .pipe(sass(sassOpts))
        .pipe(prefix(['ie 9','last 2 versions', '> 5%'], { cascade: true }))
        .pipe(concat('all-' + timestamp() + '.css'))
        .pipe(gulp.dest(stylePub))
        .pipe(minCss({keepBreaks: false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(plumber.stop())
        .pipe(gulp.dest(stylePub))
});
