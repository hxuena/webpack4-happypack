const CopyWebpackPlugin = require("copy-webpack-plugin");
const LiveReloadPlugin = require('webpack-livereload-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
module.exports = {
  plugins: [
    new LiveReloadPlugin({}),
    //处理views中的模板
    new CopyWebpackPlugin([{ 
      from: path.join(__dirname, "../"+"/src/webapp/views/common/layout.html"), 
      to: '../views/common/layout.html' 
    }]),
    //components模板
    new CopyWebpackPlugin([{ 
      from: path.join(__dirname, "../"+"/src/webapp/components/"), 
      to: '../components' 
    }], {
      copyUnmodified: true,  
      ignore: ["*.js", "*.css", "*.ts", "*.png"]
    }),
    new ExtractTextPlugin({
      filename: (getPath) => {
        return getPath("styles/[name].css")    //拦截，可以在此把css送到cdn去
      },  
      allChunks: true, //不加，就提取不出来
    }),
  ],
}