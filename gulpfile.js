const gulp = require("gulp");
const babel = require("gulp-babel");
const watch = require("gulp-watch");

gulp.task('builddev', () => {
  return watch('./src/nodeui/**/*.js', {
    ignoreInitial: false
  }, () => {
    gulp.src('./src/nodeui/**/*.js')
      .pipe(babel({
        babelrc: false,
        "plugins": ['transform-es2015-modules-commonjs']
      }))
      .pipe(gulp.dest('dist'))
  })
})

let _task = ["builddev"]
if (process.env.NODE_ENV == "production") {

}
gulp.task("default", _task)