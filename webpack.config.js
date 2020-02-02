var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './public/javascripts/main.js',
  output: {
    filename: 'bundle.js',
    //path: path.resolve(__dirname, 'dist')
    path: __dirname + '/public'
  },
  plugins: [
    new UglifyWebpackPlugin(),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   _:'underscore'
    // })
  ],
  module: {
    rules: [
      {
        test: /\.(css|png|svg|jpe?g|gif)$/,
        loader:['file-loader','style-loader', 'css-loader']
      }
    ]
  },
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