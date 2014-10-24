var gulp    = require('gulp')
var concat  = require('gulp-concat')
var rename  = require('gulp-rename')
var prefix  = require('gulp-autoprefixer')
var plumber = require('gulp-plumber')

var sass    = require('gulp-sass')
var neat    = require('node-neat').includePaths
var minCSS  = require('gulp-minify-css')

var handleErrors = require('../util/handleErrors')

var styleSrc  = [
  './src/css/**/*.scss',
  './lib/normalize.css'
]

var stylePub = './public/css/'

gulp.task('styles', function(){
  return gulp.src(styleSrc)
        .pipe(plumber({
            errorHandler: handleErrors
        }))
        .pipe(sass({
            includePaths: ['styleSrc'].concat(neat)
        }))
        .pipe(prefix(['ie 9','last 2 versions', '> 5%'], { cascade: true }))
        .pipe(concat('all.css'))
        .pipe(gulp.dest(stylePub))
        .pipe(minCSS({keepBreaks: false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(stylePub))
})
