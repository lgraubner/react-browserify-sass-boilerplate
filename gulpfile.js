var gulp = require("gulp"),
    concat = require("gulp-concat"),
    sass = require("gulp-sass"),
    uglify = require("gulp-uglify"),
    autoprefixer = require("gulp-autoprefixer"),
    minifyCSS = require("gulp-minify-css"),
    sourcemaps = require('gulp-sourcemaps');

var paths = {
    css: {
        src: ["!./css/sass/**/*.scss", "./css/**/*.css"],
        dest: "./dist/css/"
    },
    sass: {
        src: "./src/css/sass/**/*.scss",
        dest: "./src/css/"
    },
    js: {
        src: ["./src/js/**/*.js", "!./src/js/vendor/modernizr.custom.js"],
        dest: "./dist/js/"
    }
};

gulp.task("scripts", ["copy"], function() {
    return gulp.src(paths.js.src)
        .pipe(sourcemaps.init())
        .pipe(concat("scripts.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.js.dest));
});

gulp.task("copy", function() {
    return gulp.src("./src/js/vendor/modernizr.custom.js")
        .pipe(gulp.dest(paths.js.dest + "vendor/"));
});

gulp.task("sass", function() {
    return gulp.src(paths.sass.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(paths.sass.dest));
});

gulp.task("styles", ["sass"], function() {
    return gulp.src(paths.css.src)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(concat("styles.css"))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.css.dest));
});

gulp.task("watch", function() {
    gulp.watch(["./src/css/**/*.scss", "./src/css/**/*.css"], ["styles"]);
    gulp.watch(["./src/js/**/*.js"], ["scripts"]);
});

gulp.task("default", ["scripts", "styles"]);
