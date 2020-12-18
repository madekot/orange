const gulp = require('gulp');
const pug = require('gulp-pug');
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const del = require("del");
const notify = require("gulp-notify");
const typograf = require('gulp-typograf');
const gulpHtmlBemValidator = require('gulp-html-bem-validator');


// checkBemNaming
const checkBemNaming = () => {
  return gulp.src(['build/*.html'])
    .pipe(gulpHtmlBemValidator())
}

exports.checkBemNaming = checkBemNaming;


// Htmls
const htmls = () => {
  return gulp.src(['source/pug/**/*.pug', '!source/pug/includes/**/*.pug'])
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(pug({ pretty: true }))
    .pipe(typograf({ locale: ['ru', 'en-US'] }))
    .pipe(gulp.dest('./build'))
}

exports.htmls = htmls;

// Styles
const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(sourcemap.init())
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Del
const deleteImage = () => {
  return del('build/img/**/*')
}

exports.deleteImage = deleteImage;

// ImagesCopy
const imagesCopy = () => {
  return gulp.src('source/img/**/*')
    .pipe(gulp.dest('build/img'))
}

exports.imagesCopy = imagesCopy;

// Watcher
const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/pug/**/*.pug", gulp.series("htmls"));
  gulp.watch("build/*.html").on("change", sync.reload);
  gulp.watch("source/img/**/*", gulp.series(["deleteImage", "imagesCopy"]));
}

exports.default = gulp.series(
  checkBemNaming, deleteImage, imagesCopy, htmls, styles, server, watcher
);
