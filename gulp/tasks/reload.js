/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
   RELOAD

   reloads gulp when a change is made to any gulp task

   slightly adapted from noxoc's solution
   http://noxoc.de/2014/06/25/reload-gulpfile-js-on-change/

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp')
var spawn = require('child_process').spawn;

gulp.task('reload', function() {
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