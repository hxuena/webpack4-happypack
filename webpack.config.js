const argv = require("yargs-parser")(process.argv.slice(2));
const merge = require("webpack-merge");
const mode = argv.mode || "development";
const _modeflag = (mode == "production" ? true : false);
const _mergeConfig = require(`./config/webpack.${mode}.js`);
const glob = require("glob");
let _entry = {}; //空的入口文件，容错.入口文件的默认数据格式
let _plugins = [];
const files = glob.sync("./src/webapp/views/**/*.entry.ts");
const HappyWebpackPlugin = require("./config/happyWebpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {join} = require("path")
const HtmlAfterWebpackPlugin = require("./config/htmlAfterWebpackPlugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
for(let item of files) {
  if(/.+\/([a-zA-Z]+-[a-zA-Z]+)(\.entry\.ts$)/g.test(item)){
    const entryKey = RegExp.$1;
    _entry[entryKey] = item
    const [dist, template] = entryKey.split("-");
    _plugins.push(new HtmlWebpackPlugin({
      filename: `../views/${dist}/pages/${template}.html`,
      template: `src/webapp/views/${dist}/pages/${template}.html`,
      inject: false, //关闭webpack的打包后自动插入
      chunks: ['runtime', entryKey],  //保证页面只加载相关的代码
      minify: {
        collapseWhitespace:_modeflag,
        removeAttributeQuotes: _modeflag 
      }
    }))
  }
}
let webpackConfig = {
  //放置公用代码
  entry: _entry,
  module: {
    rules: [{
      test:/\.ts?$/,
      exclude: /node_modules/,
      use: 'happypack/loader?id=happyTs'
    },{
      test:/\.css?$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: 'happypack/loader?id=happyCss'
      })
    }]
  },
  output: {
    path: join(__dirname, './dist/assets'),
    publicPath: "/",
    filename: "scripts/[name].bundle.js"
  },
  watch: !_modeflag,
  optimization: {
    splitChunks: {  //抽离公用的异步的代码
      cacheGroups: { 
        commons: {
          minChunks: 2,
          minSize: 0,
          name: "commons"
        }
      },
    },
    cacheGroups: {  //抽离公用的同步的代码
      commons: {
        minChunks: 2,
        minSize: 0,
        name: "commons"
      }
    },
    runtimeChunk: {
      name: "runtime"
    }
  },
  plugins: [
    ..._plugins,
    ...HappyWebpackPlugin,
    new HtmlAfterWebpackPlugin()

  ],
  resolve: {
    extensions: [".ts",".css"]
  }
}
module.exports = merge(webpackConfig, _mergeConfig) //合并配置文件
