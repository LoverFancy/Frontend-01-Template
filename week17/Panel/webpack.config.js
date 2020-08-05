const path = require('path');

module.exports = {
  entry: "./index.js",
  module: {
    rules: [{
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                [
                  "@babel/plugin-transform-react-jsx",
                  {
                    pragma: "ToyReact.createElement",
                    // pragma: "createElement",
                    // "pragmaFrag": "Preact.Fragment"
                  },
                ],
              ],
            },
          }
          // ,
          // {
          //   loader: path.resolve('./jsx-css-scope-loader.js')
          // }
        ],
      }, {
        test: /\.css$/,
        use: {
          // loader: path.resolve('./my-css-scope-loader.js')
          loader: path.resolve('./cssloader.js')
        },
      }
    ],
  },
  mode: "development"
};
