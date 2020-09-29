const gulp = require('gulp');
const pug = require('gulp-pug');
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const del = require("del");

// Del
const del = () => {
  return del('build')
}

exports.del = del;

// Images
const images = () => {
  return gulp.src('source/img')
    .pipe(gulp.dest('build/img'))
}

exports.images = images;


// Htmls
const htmls = () => {
  return gulp.src(['source/pug/**/*.pug', '!source/pug/includes/**/*.pug'])
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('./build'))
}

exports.htmls = htmls;

// Styles
const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
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

// Watcher
const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/pug/**/*.pug", gulp.series("htmls"));
  gulp.watch("build/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  images, htmls, styles, server, watcher
);

// gulp.task('pug-compile', ()=>{
//   return gulp.src(['source/pug/**/*.pug', '!source/pug/includes/**/*.pug'])
//     .pipe(pug({pretty:true}))
//     .pipe(gulp.dest('./build'))
// });

// gulp.task('watch',()=>{
//   gulp.watch('source/pug/**/*.pug', gulp.series('pug-compile'))
// });
