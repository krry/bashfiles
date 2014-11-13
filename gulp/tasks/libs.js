var gulp = require('gulp')
var changed = require('gulp-changed')

var handleErrors = require('../util/handleErrors')

var libSrc = [
  './src/lib/jquery/dist/jquery.js',
  './src/lib/openlayers3/build/ol-debug.js',
  './src/lib/openlayers3/build/ol.css',
  './src/lib/angular-ui-router/release/angular-ui-router.min.js',
  './src/lib/angular-touch/angular-touch.js',
  './src/lib/angular-mocks/angular-mocks.js',
  './src/lib/angular/angular.js',
  './src/lib/angular/angular.min.js',
  './src/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
  './src/lib/angular-bootstrap/ui-bootstrap.min.js',
  './src/lib/normalize.css/normalize.css',
]

var libPub = './public/lib/'

gulp.task('libs', function(){
  return gulp.src(libSrc)
        .pipe(changed(libPub))
        .on('error', handleErrors)
        .pipe(gulp.dest(libPub))
})
