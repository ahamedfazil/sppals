const loadersConfig = require("./webpack.loaders.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

module.exports = function() {
  return smp.wrap({
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
  });
};
