const path = require('path');

module.exports = {
  //mode: 'production',
  mode: 'development',
  devtool: 'source-map',
  entry: {
    index: './src/js/index.js',
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'public/js'),
    clean: true,
  }
};