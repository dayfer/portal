const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  watchOptions: {
    aggregateTimeout: 600,
    poll: 1000,
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    },
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [new HtmlWebpackPlugin({
    inject: true,
    template: 'src/index_template.html'
  })],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};