// node utils
var fs = require('fs')
var bower = require('bower');
var sh = require('shelljs');

// gulp utils
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');

// other requires
var onlyScripts = require('../lib/scriptFilter')

gulp.task('default', ['build', 'watch']);

var tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts)

tasks.forEach(function(name) {
  require('./tasks/' + name)
})

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});
