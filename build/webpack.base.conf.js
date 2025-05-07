const path = require('path')
const projectRoot = path.resolve(__dirname, '../')
const ESLintPlugin = require('eslint-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const options = {
  extensions: ['.vue', '.js'],
  exclude: [`/node_modules/`],
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist/static'),
    publicPath: './static/',
    filename: '[name].js'
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'vue$': 'vue/dist/vue.common.js'
    },
    extensions: ['.js', '.vue'],
    modules: [
      path.join(__dirname, '../node_modules')
    ]
  },
  resolveLoader: {
    modules: [
      path.join(__dirname, '../node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/,
        options: { presets: ['@babel/env'] }
      },
      {
        test: /\.html$/,
        loader: 'vue-html-loader'
      },
      {
        test: /\.md$/,
        loader: 'vue-markdown-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash:7]'
        }
      }
    ]
  }
}

// ,
// plugins: [new ESLintPlugin(options)]
// eslint: {
//   formatter: require('eslint-friendly-formatter')
// }