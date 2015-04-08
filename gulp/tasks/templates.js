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
      module: 'flannel.templates',
      filename: 'templates-' + timestamp() + '.js',
      path: function (path, base) {
        // path is the full file path in local filesystem
        // base is './src/'
        // we want the public path to mirror everything after 'src'
        // so we isolate 'src', then take everything after it
        return path.split(base.split('.')[1])[1];
      }
    }))
    .pipe(gulp.dest('./src/js/'));
});
