const fs = require("fs");
const loadPicoSocketConfig = require("./loadPicoSocketConfig");

// mock reading from disk, since we don't
// actually want to attempt loading files
jest.mock("fs", () => {
  return {
    readFileSync: jest.fn(),
  };
});

describe("loadPicoSocketConfig", () => {
  it("should read a pico-socket config file", () => {
    // call function
    const htmlFileName = loadPicoSocketConfig();
    expect(fs.readFileSync).toHaveBeenCalledWith("./pico-socket.yml");
  });
  // eventually we'll probably add more tests
  // here to verify yaml content, but this scaffolding
  // should do for now...
});
