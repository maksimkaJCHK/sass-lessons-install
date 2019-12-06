// Объявляем наши плагины
const  { src, dest, parallel, watch, series } = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const  connect = require('gulp-connect');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
sass.compiler = require('node-sass');

function serveTask(done) {
  connect.server({
    root: 'public',
    livereload: true,
    port: 8080,
  }, function () {
    this.server.on('close', done)
  });
}

function style() {
  return src('scss/main.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    cascade: false,
    overrideBrowserslist: ['last 2 versions']
  }))
  .pipe(gcmq())
  .pipe(dest('public/css'))
  .pipe(cleanCSS({
    level: 1
  }))
  .pipe(dest('public/css/min'))
  .pipe(connect.reload());
}

// Просмотр файлов
function watcher() {
  watch('scss/*.scss', style);
  watch('scss/*/*.scss', style);
}

exports.style = style;

exports.default = parallel(style, watcher, serveTask);