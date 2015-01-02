/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  CONFIG
  depends on CLEAN task
  supports DEV, STAGING, and PROD tasks

  gulp pulls in environment-specific variables via JSON,
  then writes it to a config.js file which is then
  concatenated with the rest of the scripts and served
  into `index.html`

  adapts [this grunt solution](http://mindthecode.com/how-to-use-environment-variables-in-your-angular-application)
  to gulp via [gulp-ng-constant](https://www.npmjs.com/package/gulp-ng-constant)

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var del = require('del')
var rename = require('gulp-rename');
var ngConstant = require('gulp-ng-constant');

var env = process.env.NODE_ENV || 'development';
console.log("[config  ] env is:", env);

var config = {
  name: 'flannel.config',
  // deps: [],
  // constants: { "test": "test constanted!" },
};

var confile = './server/config/environments/'+env+'.json';

gulp.task('config', ['clean'], function () {
  console.log("[config  ] wiping 'config.js'");
  del('./src/js/config.js');
  console.log("[config  ] using:" , confile, "as environment config file");
  gulp.src(confile)
  .pipe(ngConstant(config))
  .pipe(rename('config.js'))
  .pipe(gulp.dest('./src/js'))
});
