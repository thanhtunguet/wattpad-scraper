const common = require('./webpack.common');
const path = require('path');
const WebpackNodeExternals = require('webpack-node-externals');

const mainExternals = [];

if (common.mode === 'development') {
  mainExternals.push(new WebpackNodeExternals());
}

module.exports = {
  ...common,
  entry: {
    main: path.resolve(__dirname, 'src', 'main.ts'),
  },
  target: 'electron-main',
  externals: mainExternals,
};
