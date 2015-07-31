var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var browserSync = require("browser-sync").create();
var del = require("del");
var es = require("event-stream");

var isProduction = true;

var changeEvent = function(evt) {
	$.util.log('File', $.util.colors.cyan(evt.path.replace(new RegExp('/.*(?=/src)/'), '')), 'was', $.util.colors.magenta(evt.type));
};

gulp.task("styles", function() {
    var sassFiles = gulp.src("src/css/scss/main.scss")
        .pipe($.sass())
        .on("error", function(err) {
            new $.util.PluginError("styles", err, { showStack: true });
        });

    return es.concat(gulp.src("src/css/vendor"), sassFiles)
        .pipe($.concat("styles.css"))
        .pipe($.autoprefixer())
        .pipe(isProduction ? $.minifyCss() : $.util.noop())
        .pipe($.size())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task("scripts", ["lint"], function() {
    return gulp.src("src/js/**/*.js")
        .pipe($.concat("scripts.js"))
        .pipe($.babel())
        .pipe(isProduction ? $.uglify() : $.util.noop())
        .pipe($.size())
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
});

gulp.task("lint", function() {
    return gulp.src("src/**/*.js")
        .pipe($.jshint({
            "esnext": true
        }))
        .pipe($.jshint.reporter("jshint-stylish"));
});

gulp.task("clean", function() {
    del(["dist/*"]);
});

gulp.task("copy", function() {
    return gulp.src(["src/**/*", "!src/js", "!src/js/**/*", "!src/css", "!src/css/**/*", "!src/**/.DS_Store", "!src/img", "!src/img/**/*"], {
        base: "src"
    }).pipe(gulp.dest("dist"));
});

gulp.task("images", function() {
    return gulp.src("src/img/**/*.{png,jpg,jpeg,gif,svg}")
        .pipe($.changed("dist/img"))
        .pipe($.imagemin())
        .pipe($.size())
        .pipe(gulp.dest("dist/img"));
});

gulp.task("watch", ["default"], function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });

    gulp.watch(["src/scss/**/*.{scss,css}"], ["styles"]).on("change", function(evt) {
        changeEvent(evt);
        browserSync.reload();
    });

    gulp.watch("src/js/**/*.js", ["scripts"]).on("change", function(evt) {
        changeEvent(evt);
        browserSync.reload();
    });

    gulp.watch("src/img/**/*.{png,jpg,jpeg,gif,svg}", ["images"]).on("change", function(evt) {
        changeEvent(evt);
    });
});

gulp.task("default", ["copy", "styles", "scripts", "images"]);
