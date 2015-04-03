/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  BUILD
  supports DEV, STAGING, and PROD tasks

  starts all independent build tasks in unison

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var runSeq = require('run-sequence').use(gulp);

module.exports = ['fonts', 'images', 'libs', 'styles', 'scripts'];
