const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;

module.exports = {
  entry: {
      popupScript: './src/popupScript/index.tsx',
      contentScript: './src/contentScript/index.tsx'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader?url=false', 'sass-loader']
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/compiled'),
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'index.css' }),
    new LicenseWebpackPlugin({
      outputFilename: 'licenses.txt'
    })
  ]
};