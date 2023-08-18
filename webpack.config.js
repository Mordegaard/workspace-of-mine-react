const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env, argv) => ({
  devtool: argv.mode === 'development' ? 'inline-source-map' : false,
  entry: {
    index: path.resolve(__dirname, 'src', 'index.js'),
    sw: path.resolve(__dirname, 'src', 'sw.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  watchOptions: {
    ignored: ['**/dist', '**/node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.((s)?css)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {url: false}
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [{
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [{
                name: 'removeViewBox',
                active: false
              }]
            }
          }
        }],
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Workspace of Mine',
      template: 'src/templates/index.html',
      filename: 'index.html',
      inject: 'body',
      chunks: ['index']
    }),
    new Dotenv({
      path: `./webpack/environments/${env.vars}/.env`
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/assets/',
          to: './assets/'
        },
        {
          from: './src/manifest.json',
          to: './manifest.json'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      root: path.resolve(__dirname),
      scripts: path.resolve(__dirname, 'src/scripts/'),
      styles: path.resolve(__dirname, 'src/styles/'),
      assets: path.resolve(__dirname, 'src/assets/'),
    },
  },
})
