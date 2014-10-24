/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
   WATCH

   watches for changes in source stylesheets and scripts

   when activated sets isWatching flag that triggers
   watchify to wrap around browserify in the scripts task

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp  = require('gulp')

var paths = {
  styles:    './src/css/**/*.css',
  scripts:   './src/js/**/*.js',
  templates: ['./src/templates/**/*.html','./src/index.html'],
}

global.isWatching = true;

gulp.task('watch', function(){
  if (global.isWatching) {
    console.log("[watch] watching switch is on")
  }
  var styleWatcher = gulp.watch(paths.styles, ['styles'])
  styleWatcher.on('change', function(e) {
    console.log('File ' + e.path + ' was ' + e.type + ', running style tasks...')
  })

  var scriptWatcher = gulp.watch(paths.scripts, ['scripts'])
  scriptWatcher.on('change', function(e) {
    console.log('File ' + e.path + ' was ' + e.type + ', running scripts tasks...')
  })

  var templateWatcher = gulp.watch(paths.templates, ['templates'])
  templateWatcher.on('change', function(e) {
    console.log('File ' + e.path + ' was ' + e.type + ', running templates tasks...')
  })
})
