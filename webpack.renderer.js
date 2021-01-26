const common = require('./webpack.common');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  ...common,
  entry: {
    renderer: path.resolve(__dirname, 'src', 'renderer.tsx'),
  },
  target: 'electron-renderer',
  module: {
    ...common.module,
    rules: [
      ...common.module.rules,
      {
        test: /\.(css|scss|sass)$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    ...common.resolve,
    extensions: [...common.resolve.extensions, '.css', '.scss'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    contentBasePublicPath: '/',
    compress: true,
    port: 3000,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(common.mode),
    }),
  ],
};
