const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  mode: isDevelopment ? 'development' : 'production',
  devtool: 'cheap-source-map',
  context: path.join(__dirname, 'src'),
  entry: ['./main.ts'],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    publicPath: '/build',
    hot: true,
  },
  output: {
    path: path.join(__dirname, 'public/build'),
    filename: 'bundle.min.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: [
          { loader: 'style-loader', options: { injectType: 'styleTag' } },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [],
};

module.exports = config;
