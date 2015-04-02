/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  INDEX FILE
  supports BUILD task

  copies the index HTML into `public` and links the asset files

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var linker = require('gulp-linker');

var env = process.env.NODE_ENV || 'development',
    styleSrc,
    libHeadSrc,
    libTailSrc,
    tmplSrc;

tmplSrc = [ 'src/index.html' ];

if (env === 'development') {
  styleSrc = [
    'public/lib/*.css',
    'public/css/**/*.css',
    '!public/css/**/*.min.css',
    '!public/lib/**/*.min.css'
  ];

  libHeadSrc = [
    'public/lib/libs-head-*.js',
    '!public/lib/libs-head-*.min.js'
  ];

  libTailSrc = [
    'public/lib/libs-tail-*.js',
    '!public/lib/libs-tail-*.min.js',
    'public/*.js',
    '!public/*.min.js',
    'public/js/**/*.js',
    '!public/js/**/*.min.js'
  ];
}

else {
  styleSrc = ['public/css/**/*.min.css'];

  libHeadSrc = ['public/lib/libs-head-*.min.js'];

  libTailSrc = [
    'public/lib/libs-tail-*.min.js',
    'public/*.min.js',
    'public/js/**/*.min.js'
  ];
}

gulp.task('indexFile', function(){
  return gulp.src(tmplSrc, {base: './src/'})
    .pipe(linker({
      scripts: styleSrc,
      startTag: '<!-- ##### HEAD STYLES ##### -->',
      endTag: '<!-- ##### HEAD STYLES END ##### -->',
      fileTmpl: '<link href="%s" rel="stylesheet"></link>',
      appRoot: 'public/'
    }))
    .pipe(linker({
      scripts: libHeadSrc,
      startTag: '<!-- ##### HEAD SCRIPTS ##### -->',
      endTag: '<!-- ##### HEAD SCRIPTS END ##### -->',
      fileTmpl: '<script src="%s"></script>',
      appRoot: 'public/'
    }))
    .pipe(linker({
      scripts: libTailSrc,
      startTag: '<!-- ##### TAIL SCRIPTS ##### -->',
      endTag: '<!-- ##### TAIL SCRIPTS END ##### -->',
      fileTmpl: '<script src="%s"></script>',
      appRoot: 'public/'
    }))
    .pipe(gulp.dest('./public/'))
});
