let rewire = require("rewire");
let proxyquire = require("proxyquire");
function loadCustomizer(module) {
  try {
    return require(module);
  } catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") {
      throw e;
    }
  }
  return config => config;
}
switch (process.argv[2]) {
  case "start":
    rewireModule(
      "react-scripts/scripts/start.js",
      loadCustomizer("./config-overrides.dev")
    );
    break;
  case "build":
    rewireModule(
      "react-scripts/scripts/build.js",
      loadCustomizer("./config-overrides.prod")
    );
    break;
  case "test":
    let customizer = loadCustomizer("./config-overrides.testing");
    proxyquire("react-scripts/scripts/test.js", {
      "../utils/createJestConfig": (...args) => {
        let createJestConfig = require("react-scripts/utils/createJestConfig");
        return customizer(createJestConfig(...args));
      }
    });
    break;
  default:
    console.log(
      'customized-config only supports "start", "build", and "test" options.'
    );
    process.exit(-1);
}


function rewireModule(modulePath, customizer) {
  let defaults = rewire(modulePath);

  let config = defaults.__get__("config");
  customizer(config);
}
