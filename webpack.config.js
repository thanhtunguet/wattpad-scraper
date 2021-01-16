const WebpackNodeExternals = require('webpack-node-externals');
const SourceMapSupport = require('webpack-source-map-support');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    index: path.resolve(__dirname, 'src', 'index.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.node'],
  },
  target: 'node',
  devtool: 'source-map',
  plugins: [new SourceMapSupport()],
  externals: [new WebpackNodeExternals()],
};
