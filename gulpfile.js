/* eslint no-param-reassign:0 */

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const watchify = require('watchify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const exorcist = require('exorcist');

const _ = {
  assign: require('lodash/object/assign'),
};
const path = require('path');

const dirs = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'build'),
};

const sassPaths = {
  src: path.join(dirs.src, '/css/scss/main.scss'),
  dest: path.join(dirs.dest, '/css/'),
};

const scriptPaths = {
  entry: path.join(dirs.src, '/js/main.jsx'),
  dest: path.join(dirs.dest, '/js/'),
  map: path.join(dirs.dest, '/js/scripts.js.map'),
};

const b = watchify(browserify(_.assign({}, watchify.args, {
  entries: scriptPaths.entry,
  debug: true,
})));

b.transform('babelify', { presets: ['es2015', 'react'] })
  .transform({
    global: true,
  }, 'uglifyify');

function lint() {
  return gulp.src(path.join(dirs.src, '/js/**/*.{js,jsx}'))
    .pipe($.eslint())
    .pipe($.eslint.format());
}

function bundle() {
  lint();
  return b.bundle()
    .on('error', (err) => {
      $.util.log(err.message);
      browserSync.notify('Browserify Error!');
      this.emit('end');
    })
    .pipe(exorcist(scriptPaths.map))
    .pipe(source('scripts.js'))
    .pipe(gulp.dest(scriptPaths.dest))
    .pipe(browserSync.stream({ once: true }));
}

b.on('update', bundle);
b.on('log', $.util.log);

gulp.task('scripts', bundle);

gulp.task('styles', () => {
  return gulp.src(sassPaths.src)
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.minifyCss())
    .pipe($.rename((p) => {
      p.basename = 'styles';
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(sassPaths.dest))
    .pipe(browserSync.stream());
});

gulp.task('default', ['scripts', 'styles'], () => {
  gulp.watch(`${dirs.src}/css/scss/**/*.{scss,css}`, ['styles']);

  browserSync.init({
    server: {
      baseDir: './',
    },
  });
});
