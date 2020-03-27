const { resolve } = require('path');
const isProd = process.env.NODE_ENV === 'production';

const common = {
  entry: {
    index: './src/index.ts'
  },
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : false,
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'build'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],    
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: {
          loader: 'ts-loader',
        },
        include: [resolve(__dirname, 'src')],
      },
    ]
  },
  externals: [
    'child_process'
  ],
  node: {
    fs: 'empty'
  }
};

module.exports = common;
