const path = require('path');
const os = require('os');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const threads = os.cpus().length - 1;

module.exports = {
  // 入口用相对路径
  entry: './src/index.tsx',
  // 输出用绝对路径
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    // // 入口文件的输出路径
    filename: 'static/js/index.js',
    // // 清除上一次打包的内容
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/i,
            // 从右往左
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    auto: true,
                    namedExport: false,
                  },
                },
              },
            ],
          },
          {
            test: /\.less$/i,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    auto: true,
                    namedExport: false,
                    localIdentName: '[path][name]__[local]',
                  },
                },
              },
              'less-loader',
            ],
          },
          {
            test: /\.(jpe?g|png|gif|webp|svg)$/i,
            type: 'asset',
          },
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/i,
            type: 'asset/resource',
          },
          {
            test: /\.(tsx?|js)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true,
                  cacheCompression: false,
                  plugins: ['react-refresh/babel'],
                },
              },
              {
                // babel开启多进程打包
                loader: 'thread-loader',
                options: {
                  workers: threads,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname, '../src'),
      cache: true,
      // eslint开启多进程打包
      threads: threads,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      favicon: path.resolve(__dirname, '../public/favicon.ico'),
    }),
    new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({ async: false }),
  ],
  devServer: {
    open: true,
    historyApiFallback: true, // 解决前端路由刷新404问题
    proxy: [
      {
        context: '/api',
        target: 'http://httpbin.org/',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    ],
  },
  mode: 'development',
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src'), // 将 `@/` 映射到 `src` 目录
    },
  },
};
