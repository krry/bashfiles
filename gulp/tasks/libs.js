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

var handleErrors = require('../util/handleErrors');

var libSrc = [
  './src/lib/normalize.css/normalize.css',
  './src/lib/openlayers3/build/ol.css',
  './src/lib/nouislider/jquery.nouislider.css',
  './src/lib/nouislider/jquery.nouislider.js',
  './src/lib/nouislider/jquery.nouislider.min.js',
  './src/lib/nouislider/Link.js',
  './src/lib/angular-nouislider/src/nouislider.js',
  './src/lib/angular-nouislider/src/nouislider.min.js',
  './src/lib/rxjs/dist/rx.all.js',
  './src/lib/rxjs/dist/rx.all.min.js',
  './src/lib/openlayers3/build/ol-debug.js',
  './src/lib/openlayers3/build/ol.js',
  './src/lib/jquery/dist/jquery.js',
  './src/lib/matthewlein-jQuery-widowFix/js/jquery.widowFix-1.3.2.js',
  './src/lib/matthewlein-jQuery-widowFix/js/jquery.widowFix-1.3.2.min.js',
  './src/lib/angular/angular.js',
  './src/lib/angular/angular.min.js',
  './src/lib/angular-animate/angular-animate.js',
  './src/lib/angular-animate/angular-animate.min.js',
  './src/lib/angular-touch/angular-touch.js',
  './src/lib/angular-ui-router/release/angular-ui-router.min.js',
  './src/lib/angular-cookies/angular-cookies.js',
  './src/lib/angular-cookies/angular-cookies.min.js',
  './src/lib/angular-mocks/angular-mocks.js',
  './src/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
  './src/lib/angular-bootstrap/ui-bootstrap.js',
  './src/lib/angular-bootstrap/ui-bootstrap.min.js',
  './src/lib/angular-input-masks/angular-input-masks.min.js',
  './src/lib/angular-input-masks/angular-input-masks.us.min.js',
  './src/lib/firebase/firebase-debug.js',
  './src/lib/firebase/firebase.js',
  './src/lib/angularfire/dist/angularfire.js',
  './src/lib/angularfire/dist/angularfire.min.js',
  './src/lib/angular-rx/dist/rx.angular.js',
  './src/js/rxjs-firebase/rx.firebase.js',
  './src/lib/moment/moment.js',
  './src/js/mailgun/mailgun_validator.js',
  './src/lib/Chart.js/Chart.js'
];

var libPub = './public/lib';

gulp.task('libs', ['bower'], function(){
  return gulp.src(libSrc)
        .pipe(changed(libPub))
        .on('error', handleErrors)
        .pipe(gulp.dest(libPub))
});
