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
var del = require('del');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var ngConstant = require('gulp-ng-constant');
var jsonCombine = require("gulp-jsoncombine");

var env = process.env.NODE_ENV || 'development';

var config = {
  name: 'flannel.config'
};

var confile = './server/config/environments/'+env+'.json';

gulp.task('config', ['clean'], function () {
  console.log("[config  ] wiping 'config.js'");
  del('./src/js/config.js');
  console.log("[config  ] using:" , confile, "as environment config file");
  return gulp.src(confile)
        .pipe(jsonCombine('results.json', function(data) {
          return new Buffer(JSON.stringify(data[env].CLIENT));
        }))
        .pipe(ngConstant(config))
        .pipe(rename('config.js'))
        .pipe(gulp.dest('./src/js'))
});
