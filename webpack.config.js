const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env, argv) => ({
  devtool: argv.mode === 'development' ? 'inline-source-map' : false,
  entry: {
    index: path.resolve(__dirname, 'src', 'index.js'),
    sw: path.resolve(__dirname, 'src', 'sw.js'),
    content: path.resolve(__dirname, 'src', 'content.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  watchOptions: {
    ignored: ['**/dist', '**/node_modules', '**/providers'],
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'providers')
        ],
        use: ['babel-loader']
      },
      {
        test: /\.((s)?css)$/,
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'providers')
        ],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
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
      inject: true,
      chunks: ['index']
    }),
    new MiniCssExtractPlugin({
      filename: "./assets/styles.css",
      chunkFilename: "./assets/styles.[id].css",
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
          from: './providers/',
          to: './'
        },
        {
          from: './src/manifest.json',
          to: './manifest.json'
        }
      ]
    }),
  ],
  resolve: {
    alias: {
      root: path.resolve(__dirname),
      scripts: path.resolve(__dirname, 'src/scripts/'),
      styles: path.resolve(__dirname, 'src/styles/'),
      assets: path.resolve(__dirname, 'src/assets/'),
    }
  },
})
