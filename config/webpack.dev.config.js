const webpack = require("webpack");
const path = require("path");
const WebpackNotifierPlugin = require("webpack-notifier");
const BundleTracker = require('webpack-bundle-tracker');

const nodeModulesPath = path.join(__dirname, "node_modules");

module.exports = {
  devtool: "cheap-module-eval-source-map",
  noInfo: true,
  entry: {
    vendors: [
      "react",
      "react-dom",
      "react-bootstrap",
      "babel-polyfill",
    ],
    app: [
      // Add the react hot loader entry point
      "react-hot-loader/patch",
      "webpack-dev-server/client?http://localhost:3000",
      "webpack/hot/only-dev-server",
      "./src/index.tsx"
    ]
  },
  target: "web",
  output: {
    filename: "app.js",
    devtoolModuleFilenameTemplate: function (info) {
      if (info.absoluteResourcePath.charAt(0) === "/") {
        return "file://" + info.absoluteResourcePath;
      } else {
        return "file:///" + info.absoluteResourcePath;
      }
    },
    devtoolFallbackModuleFilenameTemplate: function (info) {
      if (info.absoluteResourcePath.charAt(0) === "/") {
        return "file://" + info.absoluteResourcePath + "?" + info.hash;
      } else {
        return "file:///" + info.absoluteResourcePath + "?" + info.hash;
      }
    },
    publicPath: "/static/",
    path: path.join(__dirname, "..", "build"),
  },
  resolve: {
    root: [path.resolve("../src")],
    extensions: ["", ".ts", ".tsx", ".js", ".jsx", ".less", ".css"],
    modulesDirectories: ["src", "node_modules"]
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loaders: ["babel", "ts-loader"] },
      { test: /\.(png|gif|jpg|ttf|eot|otf)$/, loader: "file-loader?name=[sha512:hash:base36:7].[ext]" },
      { test: /\.css$/, loader: "style!css", include: path.resolve(__dirname, "..", "src") },
      { test: /\.less$/, loader: "style!css!less", include: path.resolve(__dirname, "..", "src") },
      { test: /\.ico$/, loader: "file?name=[name].[ext]"}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("development")
      }
    }),
    // Add the HMR plugin
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new WebpackNotifierPlugin({ alwaysNotify: true }),
    new webpack.optimize.CommonsChunkPlugin("vendors", "vendors.js", Infinity),
    new BundleTracker({filename:  path.join(__dirname, "..", 'webpack-stats.json')})
  ]
};
