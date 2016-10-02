const path = require("path");
const webpack = require("webpack");
const BundleTracker = require('webpack-bundle-tracker');

const nodeModulesPath = path.join(__dirname, "node_modules");

module.exports = {
  devtool: "source-map",
  entry: {
    vendors: [
      "react",
      "react-dom",
      "react-bootstrap",
      "babel-polyfill",
    ],
    app: ["./src/index.tsx"]
  },
  debug: true,
  noInfo: true,
  target: "web",
  output: {
    path: path.join(__dirname, "..", "dist"),
    filename: "[name].[chunkhash].js",
    publicPath: "/static/"
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin("vendors", "vendors_[hash].js"),
    new webpack.optimize.DedupePlugin(),
    new BundleTracker({filename:  path.join(__dirname, "..", 'webpack-stats-prod.json')})
  ],
  resolve: {
    root: [path.resolve("../src")],
    extensions: ["", ".jsx", ".js", ".tsx", ".ts", ".less", ".css"],
    modulesDirectories: ["src", "node_modules"]
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loaders: ["babel", "ts-loader"] },
      { test: /\.css$/, loader: "style-loader!css-loader?minimize", include: path.resolve(__dirname, "..", "src") },
      { test: /\.less$/, loader: "style-loader!css-loader?minimize!less-loader?compress", include: path.resolve(__dirname, "..", "src") },
      { test: /\.(png|gif|jpg|ttf|eot|otf)$/, loader: "file-loader?name=[sha512:hash:base36:7].[ext]" },
      { test: /\.ico$/, loader: "file?name=[name].[ext]" }
    ]
  },
}