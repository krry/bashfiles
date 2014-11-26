var gulp = require('gulp');
var changed = require('gulp-changed');

var tmplSrc = [
  'src/index.html',
  'src/templates/**/*',
];

var tmplPub = 'public/templates/**/*';

gulp.task('templates', function(){
  return gulp.src(tmplSrc, {base: './src/'})
    .pipe(changed(tmplPub))
    .pipe(gulp.dest('./public/'));
});
