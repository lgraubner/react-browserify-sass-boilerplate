"use strict";

const gulp = require("gulp");

const $ = require("gulp-load-plugins")();
const browserSync = require("browser-sync").create();
const watchify = require("watchify");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const exorcist = require("exorcist");

const _ = {
    assign: require("lodash/object/assign")
};
const path = require("path");

const isProduction = true;

const dirs = {
    src: path.join(__dirname, 'src'),
    dest: path.join(__dirname, 'build')
};

const sassPaths = {
    src: path.join(dirs.src, "/css/scss/main.scss"),
    dest: path.join(dirs.dest, "/css/")
};

const scriptPaths = {
    entry: path.join(dirs.src, "/js/main.jsx"),
    dest: path.join(dirs.dest, "/js/"),
    map: path.join(dirs.dest, "/js/scripts.js.map")
};

var b = watchify(browserify(_.assign({}, watchify.args, {
    entries: scriptPaths.entry,
    debug: true
})));

b.transform("babelify", {presets: ["es2015", "react"]})
    .transform({
        global: true,
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
        .pipe(exorcist(scriptPaths.map))
        .pipe(source("scripts.js"))
        .pipe(gulp.dest(scriptPaths.dest))
        .pipe(browserSync.stream({once: true}));
}

gulp.task("scripts", bundle);

gulp.task("styles", () => {
    return gulp.src(sassPaths.src)
        .pipe($.sourcemaps.init())
        .pipe($.sass().on("error", $.sass.logError))
        .pipe($.autoprefixer())
        .pipe(isProduction ? $.minifyCss() : $.util.noop())
        .pipe($.rename(function(path) {
            path.basename = "styles";
        }))
        .pipe($.sourcemaps.write("./"))
        .pipe(gulp.dest(sassPaths.dest))
        .pipe(browserSync.stream());
});

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
