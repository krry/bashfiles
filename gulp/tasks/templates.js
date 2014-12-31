/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  TEMPLATES
  supports BUILD task
  
  minifies and copies the template HTML into `public`

  TODO: set up minification

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
// var minifyHTML = require('gulp-minify-html');
// var rename = require('gulp-rename');
var changed = require('gulp-changed');

var tmplSrc = [
  'src/index.html',
  'src/templates/**/*',
];

var tmplPub = 'public/templates/**/*';

gulp.task('templates', function(){
  return gulp.src(tmplSrc, {base: './src/'})
    .pipe(changed(tmplPub))
    // .pipe(minHTML())
    // .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/'));
});
