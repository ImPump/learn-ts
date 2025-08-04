const { Configuration } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
/**
 * @type {Configuration}
 */
const config = {
  mode: "development",
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[chunkhash].js',
    clean: true
  },
  stats: 'errors-only',
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new MiniCssExtractPlugin()
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        moment: {
          name: "moment",
          test: /[\\/]node_modules[\\/]moment[\\/]/,
          chunks: "all"
        },
        common: {
          name: "common",
          chunks: "all",
          minChunks: 2
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'] //从右向左解析
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      }
    ]
  }
}

module.exports = config