/* eslint no-param-reassign:0 arrow-body-style:0 */

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const watchify = require('watchify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const del = require('del');
const assign = require('lodash.assign');

const config = {
  prod: (process.env.NODE_ENV === 'production'),
  scriptEntry: 'src/js/main.jsx',
  scriptDest: 'build/js/',
  sassEntry: 'src/scss/main.scss',
  sassDest: 'build/css/',
};

function lint() {
  return gulp.src('src/js/**/*.{js,jsx}')
    .pipe($.eslint())
    .pipe($.eslint.format());
}

const b = browserify({
  entries: config.scriptEntry,
  debug: !config.prod,
});

b.transform('babelify', { presets: ['es2015', 'react'] })
  .transform({
    global: true,
  }, 'uglifyify');

function bundle() {
  lint();

  return b.bundle()
    .pipe(source('scripts.js'))
    .pipe(gulp.dest(config.scriptDest));
}

const w = watchify(browserify(assign({}, watchify.args, {
  entries: config.scriptEntry,
  debug: true,
})));

w.transform('babelify', { presets: ['es2015', 'react'] })
  .transform({
    global: true,
  }, 'uglifyify');

function bundleWatch() {
  lint();

  return w.bundle()
    .on('error', (err) => {
      $.util.log(err.message);
      browserSync.notify('Watchify Error!');
      this.emit('end');
    })
    .pipe(source('scripts.js'))
    .pipe(gulp.dest(config.scriptDest))
    .pipe(browserSync.stream());
}

w.on('update', bundleWatch);
w.on('log', $.util.log);

gulp.task('scripts', bundle);
gulp.task('scripts-watch', bundleWatch);

gulp.task('styles', () => {
  return gulp.src(config.sassEntry)
    .pipe(!config.prod ? $.sourcemaps.init() : $.util.noop())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.cssnano({
      discardComments: {
        removeAll: true,
      },
    }))
    .pipe($.rename((p) => {
      p.basename = 'styles';
    }))
    .pipe(!config.prod ? $.sourcemaps.write() : $.util.noop())
    .pipe(gulp.dest(config.sassDest))
    .pipe(browserSync.stream());
});

gulp.task('watch', ['styles', 'scripts-watch'], () => {
  gulp.watch('src/scss/**/*.{scss,css}', ['styles']);
});

gulp.task('serve', ['watch'], () => {
  browserSync.init({
    server: {
      baseDir: '',
    },
  });
});

gulp.task('clean', () => {
  del(['build/**', '!build']);
});

gulp.task('build', $.sequence('clean', ['scripts', 'styles']));

gulp.task('default', ['build']);
