const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

// 错误过滤关键词（用于开发服务器）
const FILTERED_ERROR_KEYWORDS = [
  'ResizeObserver loop',
  'Unexpected usage',
  'loadForeignModule',
  'EditorSimpleWorker',
  'monaco-editor'
];

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    // 入口配置：开发环境包含编辑器，生产环境仅打包主应用
    entry: isDev
      ? {
          main: './src/main.js',
          editor: './src/editor/index.jsx'
        }
      : './src/main.js',
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
          test: /\.jsx$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
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
        },
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false
          }
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      // 主应用 HTML
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        chunks: ['main']
      }),
      // 编辑器 HTML（仅开发环境）
      ...(isDev
        ? [
            new HtmlWebpackPlugin({
              template: './src/editor.html',
              filename: 'editor.html',
              chunks: ['editor']
            })
          ]
        : []),
      // 复制静态资源
      new CopyWebpackPlugin({
        patterns: [
          { from: 'public', to: 'public' },
          { from: 'src/pages', to: 'pages' },
          { from: 'node_modules/amis/sdk', to: 'libs/amis' }
        ]
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.js', '.jsx', '.vue', '.json']
    },
    devServer: {
      static: [
        { directory: path.join(__dirname, 'dist') },
        { directory: path.join(__dirname, 'src/pages'), publicPath: '/pages' },
        { directory: path.join(__dirname, 'public'), publicPath: '/public' },
        { directory: path.join(__dirname, 'node_modules/amis'), publicPath: '/libs/amis' }
      ],
      compress: true,
      port: 8081,
      hot: true,
      client: {
        overlay: {
          errors: (error) => {
            if (error && error.message) {
              return !FILTERED_ERROR_KEYWORDS.some(keyword => error.message.includes(keyword));
            }
            return true;
          },
          warnings: false
        }
      },
      historyApiFallback: {
        rewrites: [
          { from: /^\/editor/, to: '/editor.html' },
          { from: /^\/libs/, to: context => context.parsedUrl.pathname },
          { from: /^\/pages/, to: context => context.parsedUrl.pathname },
          { from: /^\/public/, to: context => context.parsedUrl.pathname },
          { from: /./, to: '/index.html' }
        ]
      },
      headers: {
        'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
      }
    }
  };
};
