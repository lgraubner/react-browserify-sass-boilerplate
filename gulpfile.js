'use strict';

var gulp = require("gulp");
var del = require("del");
var es = require("event-stream");

var $ = require("gulp-load-plugins")();
var browserSync = require("browser-sync").create();

var isProduction = true;

var changeEvent = function(evt) {
    $.util.log('File', $.util.colors.cyan(evt.path.replace(new RegExp('/.*(?=/src)/'), '')), 'was', $.util.colors.magenta(evt.type));
};

var paths = {
    styles: {
        src: ["src/css/vendor/**/*.css", "src/css/**/*.css"],
        sassSrc: "src/css/scss/main.scss",
        dest: "dist/css"
    },
    scripts: {
        src: ["src/js/**/*.js", "!src/js/vendor/**/*.js"],
        vendorSrc: "src/js/vendor/**/*.js",
        dest: "dist/js"
    },
    images: {
        src: "src/img/**/*.{png,jpg,jpeg,gif,svg}",
        dest: "dist/img"
    }
};

gulp.task("styles", function() {
    var sassFiles = gulp.src(paths.styles.sassSrc)
        .pipe($.sass())
        .on("error", function(err) {
            new $.util.PluginError("styles", err, { showStack: true });
        });

    return es.concat(gulp.src(paths.styles.src), sassFiles)
        .pipe($.concat("styles.css"))
        .pipe($.autoprefixer())
        .pipe(isProduction ? $.minifyCss() : $.util.noop())
        .pipe($.size())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
});

gulp.task("scripts", ["lint"], function() {
    var babel = gulp.src(paths.scripts.src)
        .pipe($.babel({
            presets: ["babel-preset-es2015"]
        }));

    return es.concat(gulp.src(paths.scripts.vendorSrc), babel)
        .pipe($.concat("scripts.js"))
        .pipe(isProduction ? $.uglify() : $.util.noop())
        .pipe($.size())
        .pipe(gulp.dest(paths.scripts.dest))
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
    return gulp.src(paths.images.src)
        .pipe($.changed(paths.images.dest))
        .pipe($.imagemin())
        .pipe($.size())
        .pipe(gulp.dest(paths.images.dest));
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

    gulp.watch("src/css/**/*.{scss,css}", ["styles"]).on("change", function(evt) {
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
