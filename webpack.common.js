const path = require('path');
const WebpackObfuscator = require('webpack-obfuscator');

const mode = process.env.NODE_ENV || 'development';

let plugins = [];

if (mode === 'production') {
  plugins = [
    ...plugins,
    new WebpackObfuscator(
      {
        rotateStringArray: true,
        numbersToExpressions: true,
        splitStrings: true,
      },
      [],
    ),
  ];
}

module.exports = {
  mode,
  output: {
    path: path.resolve(__dirname, 'build'),
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
  devtool: 'source-map',
  plugins,
};
