var gulp = require("gulp"),
    concat = require("gulp-concat"),
    sass = require("gulp-sass"),
    uglify = require("gulp-uglify"),
    autoprefixer = require("gulp-autoprefixer"),
    minifyCSS = require("gulp-minify-css"),
    sourcemaps = require('gulp-sourcemaps');

gulp.task("scripts", ["copy"], function() {
    return gulp.src(["./js/**/*.js", "!./js/vendor/modernizr.custom.js"])
        .pipe(sourcemaps.init())
        .pipe(concat("scripts.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/js/"));
});

gulp.task("copy", function() {
    return gulp.src("./js/vendor/modernizr.custom.js")
        .pipe(gulp.dest("./dist/js/vendor/"));
});

gulp.task("sass", function() {
    return gulp.src("./css/sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./css/"));
});

gulp.task("styles", ["sass"], function() {
    return gulp.src(["!./css/sass", "./css/**/*.css"])
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(concat("styles.css"))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/css/"));
});

gulp.task("watch", function() {
    gulp.watch(["./css/**/*.scss", "./css/**/*.css"], ["styles"]);
    gulp.watch(["./js/**/*.js"], ["scripts"]);
});

gulp.task("default", ["scripts", "styles"]);
