const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { env } = require('../configuration.js')

const baseUse = [
  { loader: 'css-loader', options: { minimize: env.NODE_ENV === 'production' } },
  { loader: 'postcss-loader', options: { sourceMap: true } },
  'resolve-url-loader',
  { loader: 'sass-loader', options: { sourceMap: true } }
];

module.exports = {
  test: /\.(scss|sass|css)$/i,
  use: env.NODE_ENV !== 'development' ? ExtractTextPlugin.extract({ fallback: 'style-loader', use: baseUse }) : ['style-loader'].concat(baseUse),
};

