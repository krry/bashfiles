var gulp    = require('gulp')
var concat  = require('gulp-concat')
var rename  = require('gulp-rename')
var prefix  = require('gulp-autoprefixer')
var plumber = require('gulp-plumber')

var sass    = require('gulp-sass')
var minCSS  = require('gulp-minify-css')

var handleErrors = require('../util/handleErrors')

var styleSrc  = [
  './src/lib/normalize.css/normalize.css',
  './src/css/defaults/*.scss',
  './src/css/utilities/*.scss',
  './src/css/components/*.scss',
  './src/css/**/*.css',
]

var stylePub = './public/css/'

gulp.task('styles', function(){
  return gulp.src(styleSrc)
        .pipe(plumber({
            errorHandler: handleErrors
        }))
        .pipe(sass())
        .pipe(prefix(['ie 9','last 2 versions', '> 5%'], { cascade: true }))
        .pipe(concat('all.css'))
        .pipe(gulp.dest(stylePub))
        .pipe(minCSS({keepBreaks: false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(stylePub))
})
