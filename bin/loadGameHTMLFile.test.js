const fs = require("fs");
const loadGameHTMLFile = require("./loadGameHTMLFile");

// mock reading from disk, since we don't
// actually want to attempt loading files
jest.mock("fs", () => {
  return {
    readdirSync: jest.fn(),
  };
});

describe("loadGameHTMLFile", () => {
  it("should return a file name when only one is present", () => {
    fs.readdirSync.mockImplementation(() => {
      return ["my-mock-game.html", "my-mock-game.js"];
    });
    // call function
    const htmlFileName = loadGameHTMLFile();
    expect(htmlFileName).toBe("my-mock-game.html");
  });
  it("should error if more than one file is present", () => {
    fs.readdirSync.mockImplementation(() => {
      return ["my-mock-game.html", "my-mock-game-2.html"];
    });
    // call function
    expect(() => {
      loadGameHTMLFile();
    }).toThrow(/Too many html files/);
  });
  it("should error if no files are present", () => {
    fs.readdirSync.mockImplementation(() => {
      return [];
    });
    // call function
    expect(() => {
      loadGameHTMLFile();
    }).toThrow(/Could not find html game file/);
  });
  it("should error if no html files are present", () => {
    fs.readdirSync.mockImplementation(() => {
      return ["my-mock-game.js"];
    });
    // call function
    expect(() => {
      loadGameHTMLFile();
    }).toThrow(/Could not find html game file/);
  });
});
