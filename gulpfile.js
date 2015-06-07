var gulp = require("gulp"),
    concat = require("gulp-concat"),
    sass = require("gulp-sass"),
    uglify = require("gulp-uglify"),
    autoprefixer = require("gulp-autoprefixer"),
    livereload = require("gulp-livereload"),
    minifyCSS = require("gulp-minify-css"),
    sourcemaps = require('gulp-sourcemaps');

gulp.task("scripts", function() {
    return gulp.src(["./js/**/*.js", "!./js/vendor/modernizr.custom.js"])
        .pipe(sourcemaps.init())
        .pipe(concat("scripts.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/js/"))
        .pipe(livereload());
});

gulp.task("copy", function() {
    return gulp.src("./js/vendor/modernizr.custom.js")
        .pipe(gulp.dest("./dist/vendor/"));
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
        .pipe(gulp.dest("./dist/css/"))
        .pipe(livereload());
});

gulp.task("watch", function() {
    livereload.listen();
    gulp.watch(["./css/**/*.scss", "./css/**/*.css"], ["styles"]);
    gulp.watch(["./js/**/*.js"], ["scripts"]);
});

gulp.task("default", ["scripts", "styles"]);
