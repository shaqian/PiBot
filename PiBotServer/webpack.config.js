var webpack = require('webpack');
var path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: [
    'script-loader!jquery/dist/jquery.min.js',
    'script-loader!foundation-sites/dist/js/foundation.min.js',
    './app/app.jsx'
  ],
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }
    })
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  resolve: {
    modules: [
      __dirname,
      'node_modules',
      './app/components',
      './app/actions',
      './app/reducers',
      './app/store'
    ],
    alias: {
      app: 'app',
      applicationStyles: 'app/styles/app.scss'
    },
    extensions: ['*', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015', 'es2017', 'stage-2'],
          }
        }
      },
      {
        test: /\.scss?$/,
        use: {
          loader: 'sass-loader',
          options: {
            includePaths: [
              path.resolve(__dirname, './node_modules/foundation-sites/scss')
            ]
          }
        }
      },
      {
        test: /\.(woff|ttf|eot)$/,
        loader: 'url-loader?name=public/fonts/[name].[ext]'
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? undefined: 'cheap-module-eval-source-map'
};
