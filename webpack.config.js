const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true
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
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash][ext]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: 'public'
        },
        {
          from: 'src/pages',
          to: 'pages'
        },
        // 复制 amis SDK 资源
        {
          from: 'node_modules/amis/sdk',
          to: 'libs/amis'
        }
        // Amis 6.x 已内置 history，无需单独复制
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.vue', '.json']
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'dist')
      },
      {
        directory: path.join(__dirname, 'src/pages'),
        publicPath: '/pages'
      },
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/public'
      },
      // 开发环境直接访问 node_modules
      {
        directory: path.join(__dirname, 'node_modules/amis'),
        publicPath: '/libs/amis'
      }
      // Amis 6.x 已内置 history，无需单独服务
    ],
    compress: true,
    port: 8081,
    hot: true,
    historyApiFallback: true
  }
};
