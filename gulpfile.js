const gulp = require("gulp");
const sass = require("gulp-sass");
const minify = require("gulp-minify");
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const purgecss = require('gulp-purgecss')
const browserSync = require("browser-sync").create();

function devWatch() {
    browserSync.init({
        server: "./"
    });

    gulp.watch("src/styles/*.scss", convertScss).on("change", browserSync.reload);;
    gulp.watch("./src/scripts/*.js", compressJs).on("change", browserSync.reload);;
    gulp.watch("./src/images/**", gulp.series(cleanImages, compressImages));
    gulp.watch("./index.html").on("change", browserSync.reload);
}

function convertScss() {
    return gulp
        .src("src/styles/*.scss")
        .pipe(concat("style.scss"))
        .pipe(
            sass({
                outputStyle: "compressed",
                errorLogToConsole: true
            })
        )
        .on("error", sass.logError)
        .pipe(rename({ suffix: ".min" }))
        .pipe(autoprefixer({cascade: false}))
        .pipe(purgecss({
            content: ['index.html']
        }))
        .pipe(gulp.dest("./dist/styles"))
        .pipe(browserSync.stream());
}

function compressJs() {
    return gulp
        .src("./src/scripts/*.js")
        .pipe(concat("script.js"))
        .pipe(
            minify({
                noSource: true,
                ext: {
                    min: ".min.js"
                }
            })
        )
        .pipe(gulp.dest("./dist/scripts"))
        .pipe(browserSync.stream());
}

function compressImages() {
    return gulp
        .src("src/images/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/images"))
        .pipe(browserSync.stream());
}

function cleanDist() {
    return gulp
        .src("./dist", { read: false, allowEmpty: true })
        .pipe(clean())
        .pipe(browserSync.stream());
}

function cleanImages() {
    return gulp
        .src("./dist/images", { read: false, allowEmpty: true })
        .pipe(clean())
        .pipe(browserSync.stream());
}

exports.dev = devWatch;
exports.build = gulp.series(
    cleanDist,
    convertScss,
    compressJs,
    compressImages,
);