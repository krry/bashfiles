/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
   CONFIG

   gulp pulls in environment-specific JSON,
   then writes it to a public file
   to be consumed in `index.html`

   adapts [this grunt solution](http://mindthecode.com/how-to-use-environment-variables-in-your-angular-application)
   to gulp via [gulp-ng-constant](https://www.npmjs.com/package/gulp-ng-constant)

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var rename = require('gulp-rename');
var ngConstant = require('gulp-ng-constant');

var env = process.env.NODE_ENV || 'development';
console.log('process.node_env is:', process.env.NODE_ENV );
console.log('process.env is:', process.env.ENV );
console.log("env is:",env);

var config = {
  name: 'flannel.config',
  // deps: [],
  // constants: { "test": "test constanted!" },
};

var confile = './server/config/environments/'+env+'.json';
console.log("config file is:", confile);

gulp.task('config', function () {
  gulp.src(confile)
  .pipe(ngConstant(config))
  .pipe(rename('config.js'))
  .pipe(gulp.dest('./public/js'))
});
