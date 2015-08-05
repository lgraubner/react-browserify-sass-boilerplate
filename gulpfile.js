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

    return es.concat(gulp.src("src/css/vendor/**/*.css"), sassFiles)
        .pipe($.concat("styles.css"))
        .pipe($.autoprefixer())
        .pipe(isProduction ? $.minifyCss() : $.util.noop())
        .pipe($.size())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task("scripts", ["lint"], function() {
    var babel = gulp.src(["src/js/**/*.js", "!src/js/vendor/**/*.js"])
        .pipe($.babel());

    return es.concat(gulp.src("src/js/vendor/**/*.js"), babel)
        .pipe($.concat("scripts.js"))
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

gulp.task("build", ["copy", "styles", "scripts", "images"], function() {
    return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task("serve", ["default",  "watch"], function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
});

gulp.task("watch", function() {

    gulp.watch(["src/css/**/*.{scss,css}"], ["styles"]).on("change", function(evt) {
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

    gulp.watch("src/*.html", ["copy"]).on("change", function(evt) {
        changeEvent(evt);
    });
});

gulp.task("test", function() {
    return gulp.src("test/runner.html")
        .pipe($.mochaPhantomjs({
            reporter: "spec"
        }));
});

gulp.task("default", ["clean"], function() {
    gulp.start("build");
});
