var webpack = require('webpack');

module.exports = {
  entry: './index',
  output: {
    filename: 'viewport.js',
    path: './dist',
    library: 'Viewport',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel', query: {presets: ['es2015']}}
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};
