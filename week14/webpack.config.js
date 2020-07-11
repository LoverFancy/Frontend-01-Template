const path = require('path');

module.exports = {
  entry: "./main.js",
  devServer: {
    index: 'index.html'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "createElement",
                  // "pragmaFrag": "Preact.Fragment"
                },
              ],
            ],
          },
        },
      },
    ],
  },
  mode: "development",
};