/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  TEMPLATES
  supports BUILD task

  minifies and copies the template HTML into `public`

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var ngTemplates = require('gulp-ng-templates');

var timestamp = require('../util/timestamp').timestamp;

var tmplSrc = [
  'src/templates/**/*.html',
];

gulp.task('templates', ['clearTemplates'], function(){
  return gulp.src(tmplSrc, {base: './src/'})
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(ngTemplates({
      filename: 'templates-' + timestamp() + '.js',
      module: 'flannel.templates',
      path: function (path, base) {
        return path.replace(/\\/g, '/').split('src/')[1];
      }
    }))
    .pipe(gulp.dest('./src/js/'));
});
