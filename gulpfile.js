const gulp = require("gulp");
const babel = require("gulp-babel");
const watch = require("gulp-watch");
const rollup = require("gulp-rollup");
const gulpSequence = require("gulp-sequence");
const replace = require("rollup-plugin-replace");

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
gulp.task('buildprod', () => {
  gulp.src('./src/nodeui/**/*.js')
    .pipe(babel({
      babelrc: false,
      ignore: ['./src/nodeui/config/*.js'], //清洗config
      "plugins": ['transform-es2015-modules-commonjs']
    }))
    .pipe(gulp.dest('dist'))
})
gulp.task('cleanconfig', () => {
  gulp.src('./src/nodeui/**/*.js')
    .pipe(rollup({
      input: './src/nodeui/config/index.js', //rollup是打包工具，所以要配置入口文件
      output: {
        format: 'cjs'
      },
      plugins: [
        replace({
          "process.env.NODE_ENV": JSON.stringify('production') //
        })
      ]
    }))
    .pipe(gulp.dest('dist'))
})

let _task = ["builddev"]
if (process.env.NODE_ENV == "production") {
  _task = gulpSequence("buildprod", "cleanconfig")
}
gulp.task("default", _task)