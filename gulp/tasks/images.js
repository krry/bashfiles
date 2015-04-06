/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  IMAGES
  supports BUILD task

  makes responsive images, minifies, copies to `public`

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var changed = require('gulp-changed');

var handleErrors = require('../util/handleErrors');

var imgSrc = [
  './src/img/**/*'
];

var imgPub = './public/img';

gulp.task('images', ['clearImages'], function(){
  return gulp.src(imgSrc)
        .pipe(changed(imgPub))
        .on('error', handleErrors)
        .pipe(gulp.dest(imgPub))
});
