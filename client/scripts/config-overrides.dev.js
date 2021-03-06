// const path = require("path");
const LessAutoprefix = require("less-plugin-autoprefix");
const autoprefix = new LessAutoprefix({
  browsers: ["iOS 7", "last 2 versions", "Firefox > 20", "ie 6-8"]
});

module.exports = function(config) {
  let eslintLoader = config.module.rules[0];
  eslintLoader.use[0].options.useEslintrc = true;

  let loaderList = config.module.rules[1].oneOf;
  loaderList.splice(loaderList.length - 1, 0, {
    test: /\.less$/,
    use: [
      {
        loader: "style-loader"
      },
      {
        loader: "css-loader"
      },
      {
        loader: "less-loader",
        options: {
          plugins: [autoprefix]
        }
      }
    ]
  });
};
