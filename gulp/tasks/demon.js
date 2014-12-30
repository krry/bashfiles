var gulp    = require('gulp')
var nodemon = require('gulp-nodemon')
var util    = require('gulp-util')
var browserSync = require('browser-sync');
var handleErrors = require('../util/handleErrors')

var BROWSER_SYNC_RELOAD_DELAY = 500;

var env = process.env.NODE_ENV || 'development';
var debug = (env === 'development') ? '--debug' : '';

gulp.task('demon', function(cb){
  var called = false;
  console.log('[nodemon] app conceived')
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
    verbose: true,
    nodeArgs: [debug]
  }).on('start', function onStart() {
      if (!called) { cb(); }
      called = true;
      console.log('[nodemon] app started');
    })
    .on('change', function() {
      console.log('[nodemon] app changed');
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    })
    .on('restart', function onRestart() {
      console.log('[nodemon] app restarted');
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        })
      }, BROWSER_SYNC_RELOAD_DELAY);
    })
    .on('error', handleErrors)
    .on('end', cb)
})
