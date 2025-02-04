var path = require('path');

const TerserPlugin = require('terser-webpack-plugin');

var webpackConfig = {
  mode: 'production',
  entry: {
    bargauge: './src/viz-gauge.js',
  },
  devServer: {
    contentBase: './dist',
  },
  output: {
    filename: 'dist/bundle.js',
    path: path.resolve(__dirname),
    library: '[name]',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.join(__dirname, '../src'), 'node_modules'],
  },
  plugins: [new TerserPlugin()],
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: [{loader: 'babel-loader'}]},
      {test: /\.css$/, use: [{loader: 'to-string-loader'}, {loader: 'css-loader'}]},
    ],
  },
  stats: {},
};

module.exports = webpackConfig;
