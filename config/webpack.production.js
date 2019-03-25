const CopyWebpackPlugin = require("copy-webpack-plugin");
const LiveReloadPlugin = require('webpack-livereload-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
const minify = require('html-minifier').minify;
module.exports = {
  output: {
    filename:"scripts/[name].[hash:5].bundle.js"
  },
  plugins: [
    //处理views中的模板
    new CopyWebpackPlugin([{ 
      from: path.join(__dirname, "../"+"/src/webapp/views/common/layout.html"), 
      to: '../views/common/layout.html' 
    }]),
    //components模板
    new CopyWebpackPlugin([{ 
      from: path.join(__dirname, "../"+"/src/webapp/components/"), 
      to: '../components',
      transform(content) {
        //content传输的内容，一个二进制流
       return minify(content.toString("utf-8"), {
        collapseWhitespace: true
       })  //转换成字符串，避免不能处理流的情况
      }
    }], {
      ignore: ["*.js", "*.css", "*.ts", "*.png"]
    }),
    new ExtractTextPlugin({
      filename: "styles/[name][hash:5].css",  
      allChunks: true, //不加，就提取不出来
    }),
  ],
}