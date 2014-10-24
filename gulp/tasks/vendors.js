var gulp = require('gulp')
var changed = require('gulp-changed')

var handleErrors = require('../util/handleErrors')

var vndSrc = [
  './src/lib/jquery/dist/jquery.js',
  './src/lib/openlayers3/build/ol-debug.js',
  './src/lib/openlayers3/build/ol.css',
  './src/lib/angular-ui-router/release/angular-ui-router.min.js',
  './src/lib/angular-touch/angular-touch.js',
  './src/lib/angular/angular.js',
  './src/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
  './src/lib/angular-bootstrap/ui-bootstrap.min.js',
]

var publicLib = './public/lib/'

gulp.task('vendors', function(){
  return gulp.src(vndSrc)
        .pipe(changed(publicLib))
        .on('error', handleErrors)
        .pipe(gulp.dest(publicLib))
})
