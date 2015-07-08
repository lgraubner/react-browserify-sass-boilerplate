var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var stripDebug = require("gulp-strip-debug");
var jshint = require("gulp-jshint");
var browserify = require("gulp-browserify");
var minifyCSS = require("gulp-minify-css");
var clean = require("gulp-clean");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var autoprefixer = require("gulp-autoprefixer");
var livereload = require("gulp-livereload");
var imagemin = require("gulp-imagemin");

gulp.task("styles", function() {
    return gulp.src("src/scss/main.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(rename("styles.css"))
        .pipe(gulp.dest("dist/css"));
});

gulp.task("scripts", ["lint"], function() {
    return gulp.src("src/js/**/*.js")
        .pipe(concat("scripts.js"))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
});

gulp.task("lint", function() {
    return gulp.src("src/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("clean", function() {
    return gulp.src("dist/**/*", {read: false})
        .pipe(clean());
});

gulp.task("copy", ["clean"], function() {
    return gulp.src(["src/**/*", "!src/js", "!src/js/**/*", "!src/scss", "!src/scss/**/*", "!src/**/.DS_Store"], {
        base: "src"
    }).pipe(gulp.dest("dist"));
});

gulp.task("images", function() {
    return gulp.src("src/img/**/*.{png,jpg,jpeg,gif,svg}")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"));
});

gulp.task("watch", ["default"], function() {
    livereload.listen();
    gulp.watch(["src/scss/**/*.{scss,css}"], ["styles"]);
    gulp.watch("src/js/**/*.js", ["scripts"]);
});

gulp.task("default", ["copy", "styles", "scripts"]);
