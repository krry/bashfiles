var gulp = require('gulp');
var ngConstant = require('gulp-ng-constant');

var env = process.env.NODE_ENV || 'development';
console.log("env is:",env);

var config = {
  name: 'config',
  deps: [],
  constants: { env: env },
};

var confile = './server/config/environments/'+env+'.json';
console.log("config file is:", confile);

gulp.task('config', function () {
  gulp.src(confile)
  .pipe(ngConstant(config))
  .pipe(gulp.dest('./src/js/options'))
});
