const { createPicoSocketServer } = require("..");

createPicoSocketServer({
  // -------------------------------------
  // server configuration
  // -------------------------------------

  // where the js and html file are
  assetFilesPath: ".",

  // where the game html file is
  htmlGameFilePath: "./pong.html",

  // -------------------------------------
  // client configuration
  // -------------------------------------

  clientConfig: {
    // the following are indicies in GPIO
    // that the client needs to know about

    // index to read to determine the room
    // that the player joined
    roomIdIndex: 1,

    // index to determine the player id
    playerIdIndex: 0,

    // indicies that contain player specific data
    playerDataIndicies: [
      [], // there is no zeroth player,
      [4, 2, 3, 6, 7, 8, 9], // first player position, and game data
      [5], // second player position
    ],
  },
});
