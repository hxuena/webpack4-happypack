const HappyWebpack = require("happypack");
const os = require("os");//获取操作系统
const happyThreadPool  = HappyWebpack.ThreadPool({
  size:os.cpus().length
});

module.exports = [
  new HappyWebpack({
    id: 'happyTs',
    threadPool: happyThreadPool,
    verbose: true,
    loaders: [{
      path: "ts-loader",
      query: {
        happyPackMode: true //ts-loader给happypack做的优化
      }
    }]
  }),
  new HappyWebpack({
    id: 'happyCss',
    threadPool: happyThreadPool,
    loaders: [{
      loader: 'css-loader',
      options: {
        importLoaders: true,
      },
    },
    'postcss-loader']
  })
]