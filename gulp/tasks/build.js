/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  BUILD
  supports DEV, STAGING, and PROD tasks

  starts all independent build tasks in unison

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');

gulp.task('build', ['scripts', 'libs', 'styles', 'templates', 'fonts', 'images']);
