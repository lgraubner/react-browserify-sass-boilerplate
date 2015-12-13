"use strict";

const gulp = require("gulp");

const $ = require("gulp-load-plugins")();
const browserSync = require("browser-sync").create();
const watchify = require("watchify");
const browserify = require("browserify");
const source = require('vinyl-source-stream');

const assign = require('lodash/object/assign');

const isProduction = true;

const dirs = {
    src: 'src',
    dest: 'build'
};

const sassPaths = {
    src: `${dirs.src}/css/scss/main.scss`,
    dest: `${dirs.dest}/css/`
};

const scriptPaths = {
    src: `${dirs.src}/js/**/*.js`,
    dest: `${dirs.dest}/js/`
};

var b = watchify(browserify(assign({}, watchify.args, {
    entries: `${dirs.src}/js/main.js`,
    debug: isProduction
})));

b.transform("babelify", {presets: ["es2015"]})
    .transform({
        global: true
    }, "uglifyify");

b.on("update", bundle);
b.on("log", $.util.log);

function bundle() {
    return b.bundle()
        .on("error", function(err) {
            $.util.log(err.message);
            browserSync.notify("Browserify Error!");
            this.emit("end");
        })
        .pipe(source("scripts.js"))
        .pipe(gulp.dest(scriptPaths.dest))
        .pipe(browserSync.stream({once: true}));
}

gulp.task("styles", () => {
    return gulp.src(sassPaths.src)
        .pipe($.sourcemaps.init())
        .pipe($.sass().on("error", $.sass.logError))
        .pipe($.autoprefixer())
        .pipe(isProduction ? $.minifyCss() : $.util.noop())
        .pipe($.sourcemaps.write("./"))
        .pipe($.rename(function(path) {
            path.basename = "styles";
        }))
        .pipe(gulp.dest(sassPaths.dest))
        .pipe(browserSync.stream());
});

gulp.task("lint", () => {
    return gulp.src(`${dirs.src}/js/**/*.js`)
        .pipe($.jshint({
            "esnext": true
        }))
        .pipe($.jshint.reporter("jshint-stylish"));
});

gulp.task("scripts", ["lint"], bundle);

gulp.task("default", ["scripts", "styles"], () => {

    gulp.watch(`${dirs.src}/css/scss/**/*.{scss,css}`, ["styles"]).on("change", () => {
        browserSync.reload();
    });

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
