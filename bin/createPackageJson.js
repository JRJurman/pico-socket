const fs = require("fs");
const picoSocketPackage = require("../package");

const createPackageJson = (gameName) => {
  console.log("creating package.json");
  const packageConfig = {
    name: gameName,
    version: "1.0.0",
    private: true,
    scripts: {
      start: "npx pico-socket",
    },
    dependencies: {
      "pico-socket": picoSocketPackage.version,
    },
  };

  const packageTemplate = JSON.stringify(packageConfig, undefined, "\t");

  console.log(`writing ${process.cwd()}/package.json`);
  fs.writeFileSync("package.json", packageTemplate);

  console.log("complete!");
};

module.exports = createPackageJson;
