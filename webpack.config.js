var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: './static/asset/favicon.ico',
      template: './static/index.html',
      chunks: ['css', 'index', 'app', 'system', 'monitor']
    }),
    new UglifyWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      _:'underscore'
    })
  ],
  devServer: {
    host : '127.0.0.1',
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    hot : true,
    inline: true,
    port: 9000,
    open : true
  }
};