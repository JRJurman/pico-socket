const fs = require("fs");
const createPackageJson = require("./createPackageJson");

// mock writing to disk, since we want
// to capture that output
jest.mock("fs", () => {
  return {
    writeFileSync: jest.fn(),
  };
});

// mock reading the package.json,
// since we want to have a fixed value
jest.mock("../package", () => {
  return {
    version: "2.0.0",
  };
});

describe("createPackageJson", () => {
  it("should write the package.json with expected props", () => {
    // call function (should create a package json file)
    createPackageJson("my-mock-game");
    expect(fs.writeFileSync).toHaveBeenCalled();
    const [fileName, finalPackageString] = fs.writeFileSync.mock.calls[0];
    const finalPackage = JSON.parse(finalPackageString);
    expect(finalPackage).toEqual(
      expect.objectContaining({
        name: "my-mock-game",
        scripts: {
          start: "npx pico-socket",
        },
        dependencies: {
          "pico-socket": "2.0.0",
        },
      })
    );
  });
});
