#! /usr/bin/env node

const { program } = require("commander");
const { createPicoSocketServer } = require("../lib");
const {
  loadPicoSocketConfig,
  loadGameHTMLFile,
  createPackageJson,
} = require(".");

program.option("--package", "creates package.json for deployment").parse();

const options = program.opts();

try {
  const picoSocketConfig = loadPicoSocketConfig();
  const htmlFile = loadGameHTMLFile();

  if (options.package) {
    const gameName = htmlFile.split(".html")[0];
    createPackageJson(gameName);
  } else {
    console.log("starting server...");
    createPicoSocketServer({
      // hard-code assumption you are running this
      // in the folder with the html and js assets
      assetFilesPath: ".",
      htmlGameFilePath: htmlFile,

      clientConfig: picoSocketConfig,
    });
  }
} catch (e) {
  if (process.env.DEBUG) {
    console.error(e);
  } else {
    console.error(e.message);
  }
}
