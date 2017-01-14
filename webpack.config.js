var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./static/js/component/tipCard.jsx",
  output: {
    path: "./static/js",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets:['es2015', 'react']
        }
      }
    ],
    resolve: {
      extensions: ['', '.js', '.jsx']
    }
  }
};
