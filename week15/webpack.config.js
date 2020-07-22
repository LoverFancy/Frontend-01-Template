const path = require('path');

module.exports = {
  entry: "./main.js",
  devServer: {
    contentBase: path.join(__dirname, "animation"),
    index: 'animation.html'
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
      // {
      //   test: /\.pure$/,
      //   use: {
      //     loader: path.resolve('./myloader.js')
      //   },
      // },
    ],
  },
  mode: "development"
};
