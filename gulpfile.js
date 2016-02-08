/* eslint no-param-reassign:0 arrow-body-style:0 */

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const watchify = require('watchify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const exorcist = require('exorcist');
const del = require('del');

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

const browserifyOptions = {
  entries: scriptPaths.entry,
  debug: true,
};

const w = watchify(browserify(_.assign({}, watchify.args, browserifyOptions)));
const b = browserify(browserifyOptions);

function lint() {
  return gulp.src(path.join(dirs.src, '/js/**/*.{js,jsx}'))
    .pipe($.eslint())
    .pipe($.eslint.format());
}

function bundle() {
  lint();
  b.transform('babelify', { presets: ['es2015', 'react'] })
    .transform({
      global: true,
    }, 'uglifyify');

  b.on('update', bundle);
  b.on('log', $.util.log);

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

function bundleWatch() {
  lint();
  w.transform('babelify', { presets: ['es2015', 'react'] })
    .transform({
      global: true,
    }, 'uglifyify');

  w.on('update', bundle);
  w.on('log', $.util.log);

  return w.bundle()
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

gulp.task('scripts', bundle);
gulp.task('scripts-watch', bundleWatch);

gulp.task('styles', () => {
  return gulp.src(sassPaths.src)
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.cssnano())
    .pipe($.rename((p) => {
      p.basename = 'styles';
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(sassPaths.dest))
    .pipe(browserSync.stream());
});

gulp.task('watch', ['build', 'scripts-watch'], () => {
  gulp.watch(`${dirs.src}/css/scss/**/*.{scss,css}`, ['styles']);
});

gulp.task('serve', ['watch'], () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
});

gulp.task('clean', () => {
  del(['build/**', '!build']);
});

gulp.task('build', $.sequence('clean', ['scripts', 'styles']));

gulp.task('default', ['build']);
