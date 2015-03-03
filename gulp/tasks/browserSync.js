/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  BROWSERSYNC
  supports DEFAULT task

  runs a new webserver on http://localhost:{PORT+1} that
  watches for changes in client-side files and injects
  them or automatically reloads the app as you develop

  slight delay keeps BrowserSync from watching the app
  before it has started running

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

// var fs          = require('fs');
// var gulp        = require('gulp');
// var browserSync = require('browser-sync');

// var port = '8100';
// var INITIAL_SERVER_BOOT_DELAY = 1000;

// browserSync.use({
//   hooks: {
//     'client:js': fs.readFileSync('./gulp/util/browserSyncReloader.js', 'utf-8')
//   }
// });

// gulp.task('browserSync', ['demon'], function() {
//   setTimeout(function(){
//     browserSync.init(null, {
//       proxy: 'http://localhost:' + port,
//       files: ['./public/**/*.*'],
//       port: port,
//       open: true,
//       injectChanges: true,
//       reloadDelay: 2000,
//     });
//   }, INITIAL_SERVER_BOOT_DELAY);
// });
