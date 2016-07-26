(function (gulp, babel, watch) {
  gulp.task('default', function() {
    return gulp.src('src/**/*')
      .pipe(
        babel({
          presets: ['es2015']
        })
      ).pipe(gulp.dest('.'));
  });
  gulp.task('watch', function () {
    // Endless stream mode
    return watch('src/**/*', {
      ignoreInitial: false,
      verbose: true
    }).pipe(
        babel({
          presets: ['es2015']
        })
    ).pipe(gulp.dest('.'));
});
})(require('gulp'), require('gulp-babel'), require('gulp-watch'))
