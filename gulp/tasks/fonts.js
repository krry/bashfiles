/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  FONTS
  supports BUILD task

  copies, formats, and minifies custom fonts into `public`

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var changed = require('gulp-changed');

var handleErrors = require('../util/handleErrors');

var fontSrc = [
  './src/fonts/**/*'
];

var fontPub = './public/fonts';

gulp.task('fonts', ['clearFonts'], function(){
  return gulp.src(fontSrc)
        .pipe(changed(fontPub))
        .on('error', handleErrors)
        .pipe(gulp.dest(fontPub))
});
