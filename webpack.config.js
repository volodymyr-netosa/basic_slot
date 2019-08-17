const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const serverConfig = {
  mode: 'none',
  entry: './src/server.ts',                
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js'
  },
  module: {
    rules: [
      { 
        test: /\.ts$/, 
        loader: 'ts-loader' 
      },
    ]
  },
  target: "node",
  node: {
    // dirname not '/'
    __dirname: false,   
    __filename: false,
  },
  externals: [nodeExternals()]
};
 
const webConfig = {
  mode: 'none',
  entry: {
    game: './src/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      { 
        test: /\.ts$/, 
        loader: 'ts-loader' 
      },
      {
        test: /\.html$/,
        use: [{loader: "html-loader"}]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/views/index.html",
      filename: "./public/index.html",
      favicon: "./src/public/assets/icon.ico",
      chunks: []
    }),
    new HtmlWebpackPlugin({
      template: "./src/views/game.html",
      filename: "./public/game.html",
      favicon: "./src/public/assets/icon.ico",
      chunks: ["game"]
    }),
    new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: []}),
    new CopyPlugin([
      { from: 'src/public/assets', to: 'assets' },
    ])
  ],
  watch: true,
}
module.exports = [serverConfig, webConfig]