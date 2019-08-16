const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const serverConfig = {
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
 
const frontConfig = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
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
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/views/index.html",
      filename: "./public/index.html",
      // excludeChunks: [ 'server' ]
    })
  ],
}
module.exports = [serverConfig, frontConfig]