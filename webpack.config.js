/**
 * This is a classic case of RTFM situation :)
 * All the configurations you see before you are taken from their documentation page, hand to hart.
 */

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';
const commonPlugins = [
  new ExtractTextPlugin({
    filename: 'bundle.css',
    disable: false,
    allChunks: true,
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.js',
    minChunks: Infinity,
  }),
];

module.exports = {
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'reselect',
      'styled-components',
    ],
    app: ['./app/index.jsx'],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },
  resolve: {
    alias: { App: path.resolve(__dirname, 'app/') },
    extensions: ['.js', '.jsx', '.scss'],
  },
  module: {
    rules: [
      // js[x]
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            'react',
            ['env', { targets: { browsers: ['last 2 versions', 'safari >= 10'] } }],
          ],
        },
      },

      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },

      // fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=static/[name].[ext]',
      },

      // sass
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        }),
      },
    ],
  },
  devtool: PRODUCTION ? 'source-map' : false,
  devServer: {
    compress: true,
    publicPath: 'https://localhost:8080/build/',
  },
  plugins: PRODUCTION ? [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
  ].concat(commonPlugins) : [
  ].concat(commonPlugins),
};
