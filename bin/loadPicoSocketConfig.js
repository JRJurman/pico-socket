const yaml = require("js-yaml");
const fs = require("fs");

/** load pico-socket.yml config
 * - in the future this could be made more flexible
 * but for now, we'll hard-code the expectations
 */
const loadPicoSocketConfig = () => {
  console.log(`loading ${process.cwd()}/pico-socket.yml`);
  const picoSocketConfig = yaml.load(fs.readFileSync("./pico-socket.yml"));
  console.log("  pico-socket config loaded!");
  return picoSocketConfig;
};

module.exports = loadPicoSocketConfig;
