const webpack = require("webpack");
const path = require("path");
const fileSystem = require("fs");
const env = require("./utils/env");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const secretsPath = path.join(__dirname, "secrets." + env.NODE_ENV + ".js");

const alias = {
  "react-dom": "@hot-loader/react-dom",
};

const fileExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "eot",
  "otf",
  "svg",
  "ttf",
  "woff",
  "woff2",
];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

const options = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    index: path.join(__dirname, "src", "pages", "index.tsx"),
    popup: path.join(__dirname, "src", "pages", "popup.tsx"),
    options: path.join(__dirname, "src", "pages", "options.tsx"),
    background: path.join(__dirname, "src", "pages", "background.ts"),
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.scss/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: new RegExp(".(" + fileExtensions.join("|") + ")$"),
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => "." + extension)
      .concat([".ts", ".tsx", ".jsx", ".js", ".css", ".scss"]),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new CopyWebpackPlugin([
      {
        from: "src/manifest.json",
        transform: function (content, path) {
          return Buffer.from(
            JSON.stringify({
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            })
          );
        },
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "pages", "index.html"),
      filename: "index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "pages", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "pages", "options.html"),
      filename: "options.html",
      chunks: ["options"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "pages", "background.html"),
      filename: "background.html",
      chunks: ["background"],
    }),
    new WriteFilePlugin(),
  ],
};

if (env.NODE_ENV === "development") {
  // options.devtool = "cheap-module-eval-source-map";
  options.devtool = "source-map";
}

module.exports = options;
