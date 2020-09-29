const gulp = require('gulp');
const pug = require('gulp-pug');

gulp.task('pug-compile', ()=>{
  return gulp.src(['source/pug/**/*.pug', '!source/pug/includes/**/*.pug'])
    .pipe(pug({pretty:true}))
    .pipe(gulp.dest('./build'))
});

gulp.task('watch',()=>{
  gulp.watch('source/pug/**/*.pug', gulp.series('pug-compile'))
});
