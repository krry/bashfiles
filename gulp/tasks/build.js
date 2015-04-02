/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  BUILD
  supports DEV, STAGING, and PROD tasks

  starts all independent build tasks in unison

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var runSeq = require('run-sequence').use(gulp);
// 
// gulp.task('build', function(){
//   runSeq(['fonts', 'images', 'libs', 'templates', 'styles', 'scripts']);
// })
module.exports = ['fonts', 'images', 'libs', 'templates', 'styles', 'scripts'];
