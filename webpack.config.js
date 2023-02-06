 const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
     //mode: 'production',
     mode: 'development',
     entry: {
       index: './src/index.js',
     },
     devtool: 'inline-source-map',
     output: {
       filename: 'bundle.js',
       path: path.resolve(__dirname, 'public/js'),
       clean: true,
     }
 };