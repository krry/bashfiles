/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  LIBS
  supports BUILD task, depends on BOWER task

  concatentates third-party libs (JS and CSS mostly) and
  copies them to `public` for use in the DOM

  TODO: concatentate them in the proper order to minimize
  HTTP calls for the production app

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var ugilfy = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

var handleErrors = require('../util/handleErrors');
var timestamp = require('../util/timestamp').timestamp;

var libCssSrc = [
  './src/lib/normalize.css/normalize.css',
  './src/lib/nouislider/jquery.nouislider.css',
  './src/lib/openlayers3/build/ol.css'
]

var libHeadSrc = [
  './src/lib/angular/angular.js',
  './src/lib/angular/angular.min.js',
  './src/lib/rxjs/dist/rx.all.js',
  './src/lib/rxjs/dist/rx.all.min.js',
  './src/lib/openlayers3/build/ol-debug.js',
  './src/lib/openlayers3/build/ol.js',
  './src/lib/jquery/dist/jquery.js',
  './src/lib/matthewlein-jQuery-widowFix/js/jquery.widowFix-1.3.2.js',
  './src/lib/matthewlein-jQuery-widowFix/js/jquery.widowFix-1.3.2.min.js',
  './src/js/mailgun/mailgun_validator.js',
  './src/lib/Chart.js/Chart.js'
];

var libTailSrc = [
  './src/lib/angular-touch/angular-touch.js',
  './src/lib/angular-cookies/angular-cookies.js',
  './src/lib/angular-cookies/angular-cookies.min.js',
  './src/lib/angular-ui-router/release/angular-ui-router.min.js',
  './src/lib/angular-input-masks/angular-input-masks.min.js',
  './src/lib/angular-input-masks/angular-input-masks.us.min.js',
  './src/lib/moment/moment.js',
  './src/lib/nouislider/jquery.nouislider.js',
  './src/lib/nouislider/jquery.nouislider.min.js',
  './src/lib/nouislider/Link.js',
  './src/lib/angular-nouislider/src/nouislider.js',
  './src/lib/angular-nouislider/src/nouislider.min.js',
  './src/lib/firebase/firebase-debug.js',
  './src/lib/firebase/firebase.js',
  './src/lib/angularfire/dist/angularfire.js',
  './src/lib/angularfire/dist/angularfire.min.js',
  './src/lib/angular-rx/dist/rx.angular.js',
  './src/js/rxjs-firebase/rx.firebase.js',
];

var libPub = './public/lib';

gulp.task('libs', ['bower', 'libHead', 'libCss', 'libTail']);

gulp.task('libHead', function (){
  var currentTime = timestamp();
  return gulp.src(libHeadSrc)
        .pipe(plumber(handleErrors))
        .pipe(changed(libPub))
        .pipe(concat('libs-head-'+ currentTime + '.js'))
        .pipe(gulp.dest(libPub))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(libPub));
});

gulp.task('libCss', function (){
  var currentTime = timestamp();
  return gulp.src(libCssSrc)
        .pipe(plumber(handleErrors))
        .pipe(changed(libPub))
        .pipe(concat('libs-css-'+ currentTime + '.css'))
        .pipe(gulp.dest(libPub))
        .pipe(minifyCss({ keepBreaks: false }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(libPub));
});

gulp.task('libTail', function (){
  var currentTime = timestamp();
  return gulp.src(libTailSrc)
        .pipe(plumber(handleErrors))
        .pipe(changed(libPub))
        .pipe(concat('libs-tail-'+ currentTime + '.js'))
        .pipe(gulp.dest(libPub))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(libPub));
});
