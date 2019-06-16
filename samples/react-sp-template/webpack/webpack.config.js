const loadersConfig = require("./webpack.loaders.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = function() {
  return {
    entry: {
      app: ["react-hot-loader/patch", "./src/index.tsx"]
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", "min.js", ".json"],
      modules: ["node_modules"]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "src/index.html"
      }),
      new webpack.ProvidePlugin({
        React: "react"
      })
    ],
    module: {
      rules: loadersConfig
    }
  };
};
