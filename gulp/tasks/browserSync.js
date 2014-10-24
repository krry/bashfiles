var gulp        = require('gulp');
var browserSync = require('browser-sync');

var INITIAL_SERVER_BOOT_DELAY = 1000;

gulp.task('browserSync', ['demon'], function() {
  setTimeout(function(){
    browserSync.init(null, {
      proxy: 'http://localhost:8100',
      files: ['./public/**/*.*'],
      port: 8100,
      injectChanges: true,
      browser: ['google chrome'],
      
    });
  }, INITIAL_SERVER_BOOT_DELAY)
});
