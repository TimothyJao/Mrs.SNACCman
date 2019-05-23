const path = require('path');

module.exports = {
  context: __dirname,
  entry: './frontend/src/index.js',
  output: {
    path: path.resolve(__dirname, "frontend", "public"),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '*']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/env', '@babel/react']
          }
        },
      }
    ]
  },
  devtool: 'inline-source-map'
};