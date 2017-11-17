const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: "[name].bundle.css"
});

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const optimizeCss = new OptimizeCssAssetsPlugin({
  cssProcessor: require('cssnano'),
  cssProcessorOptions: { discardComments: { removeAll: true } },
  canPrint: true
});

const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpack = new HtmlWebpackPlugin({
  title: "Atlas App",
  template: "components.ejs",
  inject: 'body'
});


module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    atlas: ['./index.js']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    library: 'atlas'
  },
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [ {
            loader: "css-loader",
            options: {
              sourceMap: false,
              // minimize: true // use OptimizeCssAssetsPlugin instead
            }
          },
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: { 
              sourceMap: true
            }
          }],
          publicPath: "/dist"
        })
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: 'file-loader?name=fonts/[name].[ext]&publicPath=/',
        include: path.resolve(__dirname, './src/fonts')
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: 'file-loader?name=images/[name].[ext]&publicPath=/dist/',
        include: path.resolve(__dirname, './src/images')
      }
    ]
  },

  plugins: [
    extractSass,
    // optimizeCss, // enable when needed
    htmlWebpack
  ],

  externals: {
    jquery: 'jQuery'
  }
}
