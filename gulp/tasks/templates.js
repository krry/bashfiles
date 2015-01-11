/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  TEMPLATES
  supports BUILD task
  
  minifies and copies the template HTML into `public`

  TODO: make minification contingent on process.env.NODE_ENV

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var rename = require('gulp-rename');
var changed = require('gulp-changed');
// var minifyHTML = require('gulp-minify-html');

var tmplSrc = [
  'src/index.html',
  'src/templates/**/*.html',
];

var tmplPub = 'public/templates';

// var minOpts = {
//   comments: true,
//   spare: true
// };

// gulp.task('templates', function(){
//   return gulp.src(tmplSrc, {base: './src/'})
//     .pipe(changed(tmplPub))
//     .pipe(gulp.dest('./public/'))
//     .pipe(minifyHTML(minOpts))
//     .pipe(rename({suffix: '.min'}))
//     .pipe(gulp.dest('./public/'))
// });

gulp.task('templates', function(){
  return gulp.src(tmplSrc, {base: './src/'})
    .pipe(changed(tmplPub))
    .pipe(gulp.dest('./public/'))
});
