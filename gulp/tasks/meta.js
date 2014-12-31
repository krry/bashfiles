/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  META
  supports DEV task

  gulp watches changes in itself, reboots itself

  slightly adapted from noxoc's solution
  http://noxoc.de/2014/06/25/reload-gulpfile-js-on-change/

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp')
var spawn = require('child_process').spawn;

gulp.task('meta', function() {
  var process;

  function restart() {
    if (process) {
      process.kill();
    }

    process = spawn('gulp', ['default'], {stdio: 'inherit'});
  }

  gulp.watch(['gulp/tasks/**/*.js', 'package.json'], restart);
  restart();
});
