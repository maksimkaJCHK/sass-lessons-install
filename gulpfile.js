// Выводим служебные функции gulp
const  { src, dest, parallel, watch, series } = require('gulp');
// Объявляем наши модули
const sass = require('gulp-sass');
const  connect = require('gulp-connect');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
sass.compiler = require('node-sass');

// Настраиваем  локальный сервер, локальный сервер будет брать файлы из папки public, и отображать их по адресу http://localhost:8080/

function serveTask(done) {
  connect.server({
    root: 'public',
    livereload: true,
    port: 8080,
  }, function () {
    this.server.on('close', done)
  });
}

// Настраиваем задачу для компиляции стилей. Компилируем данный файл "scss/main.scss", в нем как правило подключаются остальные файлы. Приделаем туда автопрефиксер, группировку медиазапросов, минификацию файлов, и сделаем так, чтобы наша сборка показывала строку с ошибкой если мы ее допустим.

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

// Просмотр файлов, если в папке "scss" происходят какие либо изменения с файлами имеющие расширения ".scss" то выполняем задачу "style"

function watcher() {
  watch('scss/*.scss', style);
  watch('scss/*/*.scss', style);
}

exports.style = style;

// Задачи которые будут выполнены когда мы введем в консоли gulp. Будут скомпилированы стили, запущен watcher и локальный сервер. Все эти задачи будут запущены паралельно, независимо друг от друга.

exports.default = parallel(style, watcher, serveTask);