/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  DEMON

  runs the app using **nodemon**, which watches for changes
  in server-side files that BrowserSync ignores, then
  reloads the app as needed as you develop

  delays BrowserSync a bit to keep from being outrun

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp    = require('gulp');
var util    = require('gulp-util');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var handleErrors = require('../util/handleErrors');

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || '8100';

var debug = (env === 'development') ? '--debug' : '';

var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('demon', function(cb){
  var called = false;
  console.log('[nodemon ] app conceived');
  return nodemon({
    script: 'server/server.js',
    env: {
      'NODE_ENV': env
    },
    watch: [
      'server/server.js'
    ],
    ignore: [
      '*.scss',
      '*.css'
    ],
    verbose: false,
    nodeArgs: [debug]
  }).on('start', function onStart() {
      if (!called) { cb(); }
      called = true;
      console.log('[nodemon ] app started');
    })
    .on('change', function onChange() {
      console.log('[nodemon ] app changed');
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    })
    .on('restart', function onRestart() {
      console.log('[nodemon ] app restarted');
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        })
      }, BROWSER_SYNC_RELOAD_DELAY);
    })
    .on('error', handleErrors)
    .on('end', cb)
});
