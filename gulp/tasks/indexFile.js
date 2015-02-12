/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  INDEX FILE
  supports BUILD task
  
  copies the index HTML into `public` and links the asset files

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var linker = require('gulp-linker');

var env = process.env.NODE_ENV || 'development',
    scriptSrc,
    styleSrc;

var tmplSrc = [
  'src/index.html',
];

if (env === 'development') {
  scriptSrc = ['public/*.js', 'public/js/**/*.js', '!public/js/**/*.min.js'];
  styleSrc = ['public/css/**/*.css', '!public/css/**/*.min.css'];
} else {
  scriptSrc = ['public/*.js', 'public/js/**/*.min.js'];
  styleSrc = ['public/css/**/*.min.css'];
}

gulp.task('indexFile', ['styles', 'scripts', 'templates'], function(){
  return gulp.src(tmplSrc, {base: './src/'})
    .pipe(linker({
      scripts: scriptSrc,
      startTag: '<!--SCRIPTS-->',
      endTag: '<!--SCRIPTS END-->',
      fileTmpl: '<script src="%s"></script>',
      appRoot: 'public/'
    }))
    .pipe(linker({
      scripts: styleSrc,
      startTag: '<!--STYLES-->',
      endTag: '<!--STYLES END-->',
      fileTmpl: '<link href="%s" rel="stylesheet"></link>',
      appRoot: 'public/'
    }))
    .pipe(gulp.dest('./public/'))
});
