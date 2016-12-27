var gulp = require('gulp');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var notify = require("gulp-notify");
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var server = require('gulp-server-livereload');
var less = require('gulp-less');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var ftp = require('gulp-ftp'); 
var realFavicon = require ('gulp-real-favicon');
var plumber = require('gulp-plumber');
var run = require("run-sequence");
var fs = require('fs');


/// Сборка проекта

// Очищаем папку dist
gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
  .pipe(clean());
});

// минифицируем графику и сохраняем в папку для продакшена
gulp.task('image', function () {
  return gulp.src('app/img/**')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img/'))
});

// копирование шрифтов
gulp.task('copy', function() {
  return gulp.src([
    "app/fonts/**/*.{woff,woff2}",
    "app/*.html",
    "app/css/**",
    "app/js/**",   
  ], {
    base: "app"
  })
  .pipe(gulp.dest("dist"));
});

// запуск локального сервера
// local server with livereload
gulp.task('webserver', function() {
  gulp.src('app')
  .pipe(server({
    livereload: true,
    directoryListing: false,
    open: true,
    defaultFile: 'index.html'
  }));
});

// компиляция less. 
gulp.task('less', function () {
  return gulp.src('app/less/style.less')
  .pipe(less())
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('app/css'))
  .pipe(minifyCss())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('app/css'))
  .pipe(notify("Less скомпилирован!"));
});

// минифицируем js 
gulp.task('js', function () {
  return gulp.src('app/js/app.js')
  .pipe(uglify())
  .pipe(rename("app.min.js"))
  .pipe(gulp.dest('app/js/'))
});

// отслеживаем изменения в проекте 
gulp.task('watch', function (){
  gulp.watch('app/less/**/*.less', ['less']);
  gulp.watch('app/js/app.js', ['js']);
});

gulp.task('default', ['webserver', 'less', 'js', 'watch']);

// запуск сборки
gulp.task("build", function(fn) {
  run(
    "clean",
    "less",
    "js",
    "image",
    "copy",
    fn
  );
});
