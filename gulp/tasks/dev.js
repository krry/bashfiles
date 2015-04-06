/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  DEV
  root task
  depends on CONFIG task

  cleans out the compiled files and makes sure that gulp
  is watching itself for changes as well

  gulp watches changes in itself, reboots itself

  slightly adapted from noxoc's solution
  http://noxoc.de/2014/06/25/reload-gulpfile-js-on-change/

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp')
var spawn = require('child_process').spawn;

gulp.task('dev', ['config'], function() {
  var process;

  function restart() {
    if (process) {
      process.kill();
    }

    process = spawn('gulp', ['default'], {stdio: 'inherit'});
  }

  gulp.watch(['gulp/tasks/**/*.js', 'package.json', 'server/config/environments/*.json'], restart);
  restart();
});
