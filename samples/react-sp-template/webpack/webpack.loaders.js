const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV === 'dev';

module.exports = [
  // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
  {
    enforce: "pre",
    test: /\.js$/,
    loader: "source-map-loader",
    exclude: /node_modules/
  },
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: "awesome-typescript-loader"
  },
  {
    test: /\.css$/,
    use: ["style-loader", "css-loader"]
  },
  {
    test: /\.scss/,
    exclude: /node_modules/,
    use: [
      devMode ? "style-loader" : MiniCssExtractPlugin.loader,
      "css-loader",
      "sass-loader"
    ]
  },
  {
    test: /\.(jpe?g|png|gif|svg|ico)$/i,
    loader: "file-loader",
    options: {
      name: "/styles/[name].[ext]"
    }
  }
];
