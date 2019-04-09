const gulp = require("gulp");
const babel = require("gulp-babel");
const watch = require("gulp-watch");
const rollup = require("gulp-rollup");
const gulpSequence = require("gulp-sequence");
const replace = require("rollup-plugin-replace");
const eslint = require('gulp-eslint');

gulp.task('builddev', () => {
  return watch('./src/nodeui/**/*.js', {
    ignoreInitial: false
  }, () => {
    gulp.src('./src/nodeui/**/*.js')
      .pipe(babel({
        babelrc: false,
        "plugins": ["transform-es2015-modules-commonjs", "transform-decorators-legacy"]
      }))
      .pipe(gulp.dest('dist'))
  })
})
gulp.task('buildprod', () => {
  gulp.src('./src/nodeui/**/*.js')
    .pipe(babel({
      babelrc: false,
      ignore: ['./src/nodeui/config/*.js'], //清洗config
      "plugins": ['transform-es2015-modules-commonjs', 'transform-decorators-legacy']
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

gulp.task('lint', () => {
  gulp.src('./src/nodeui/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

let _task = ["builddev"]
if (process.env.NODE_ENV == "production") {
  _task = gulpSequence("lint", "buildprod", "cleanconfig")
}
if (process.env.NODE_ENV == "lint") {
  _task = gulpSequence("lint")
}
gulp.task("default", _task)