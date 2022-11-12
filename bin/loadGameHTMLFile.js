const fs = require("fs");

// find the html game
// in the future, this interface could be made more flexible
// but for now, we'll just hard-code the expectations
const loadGameHTMLFile = () => {
  console.log("loading game html file...");
  console.log(`  searching in "${process.cwd()}"`);
  const directory = fs.readdirSync(".");
  const htmlFiles = directory.filter((file) => file.match(/.html$/));
  if (htmlFiles.length === 0) {
    throw "Could not find html game file, make sure to run this program in the directory with the game file";
  }
  if (htmlFiles.length > 1) {
    throw "Too many html files, could not determine which to run";
  }

  const htmlFile = htmlFiles.at(0);
  console.log(`  found ${htmlFile}!`);
  return htmlFile;
};

module.exports = loadGameHTMLFile;
