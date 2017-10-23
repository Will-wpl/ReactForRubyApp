const path = require('path');

module.exports = {
  test: /\.js(\.erb)?$/,
  exclude: /node_modules(?!\/atlas)/,
  loader: 'babel-loader'
}
