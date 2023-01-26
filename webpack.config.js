 const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   mode: 'development',
   entry: {
     index: './src/index.html',
   },
   devtool: 'inline-source-map',

  devServer: {
    static: './build',
  },
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Development',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'public'),
     clean: true,
   },

  optimization: {

    runtimeChunk: 'single',

  },
 };