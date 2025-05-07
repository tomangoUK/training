var webpack = require('webpack')
const { merge } = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var Path = require('path')
var PrerenderSpaPlugin = require('prerender-spa-plugin')
var pageRoutes = require('../src/routes')
var routePaths = []

pageRoutes.map(function(el) {
  routePaths.push(el.altPath || el.path)
})

// whether to generate source map for production files.
// disabling this can speed up the build.
// var SOURCE_MAP = true

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    // naming output files with hashes for better caching.
    // dist/app.html will be auto-generated with correct URLs.
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js',
    publicPath: '/static/'
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    // generate dist app.html with correct asset hash for caching.
    // you can customize output by editing /app.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: 'app.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    })
    // ,

    // new PrerenderSpaPlugin({
    //   staticDir: Path.join(__dirname, '../dist'),
    //   routePaths
    // })
  ]
})
