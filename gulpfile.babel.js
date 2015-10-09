import gulp from "gulp";
import del from "del";
import es from "event-stream";

const $ = require("gulp-load-plugins")();
const browserSync = require("browser-sync").create();

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

gulp.task("styles", () => {
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

gulp.task("scripts", ["lint"], () => {
    var babel = gulp.src(paths.scripts.src)
        .pipe($.babel());

    return es.concat(gulp.src(paths.scripts.vendorSrc), babel)
        .pipe($.concat("scripts.js"))
        .pipe(isProduction ? $.uglify() : $.util.noop())
        .pipe($.size())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
});

gulp.task("lint", () => {
    return gulp.src("src/**/*.js")
        .pipe($.jshint({
            "esnext": true
        }))
        .pipe($.jshint.reporter("jshint-stylish"));
});

gulp.task("clean", () => {
    del(["dist/*"]);
});

gulp.task("copy", () => {
    return gulp.src(["src/**/*", "!src/js", "!src/js/**/*", "!src/css", "!src/css/**/*", "!src/**/.DS_Store", "!src/img", "!src/img/**/*"], {
        base: "src"
    }).pipe(gulp.dest("dist"));
});

gulp.task("images", () => {
    return gulp.src(paths.images.src)
        .pipe($.changed(paths.images.dest))
        .pipe($.imagemin())
        .pipe($.size())
        .pipe(gulp.dest(paths.images.dest));
});

gulp.task("build", ["copy", "styles", "scripts", "images"], () => {
    return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task("serve", ["default",  "watch"], () => {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
});

gulp.task("watch", () => {

    gulp.watch("src/css/**/*.{scss,css}", ["styles"]).on("change", (evt) => {
        changeEvent(evt);
        browserSync.reload();
    });

    gulp.watch("src/js/**/*.js", ["scripts"]).on("change", (evt) => {
        changeEvent(evt);
        browserSync.reload();
    });

    gulp.watch("src/img/**/*.{png,jpg,jpeg,gif,svg}", ["images"]).on("change", (evt) => {
        changeEvent(evt);
    });

    gulp.watch("src/*.html", ["copy"]).on("change", (evt) => {
        changeEvent(evt);
    });
});

gulp.task("test", () => {
    return gulp.src("test/runner.html")
        .pipe($.mochaPhantomjs({
            reporter: "spec"
        }));
});

gulp.task("default", ["clean"], () => {
    gulp.start("build");
});
