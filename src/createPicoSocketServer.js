const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const createPicoSocketClient = require("./createPicoSocketClient");

/**
 * createPicoSocketServer - creates the server and sets up basic room
 * joining and data updating logic
 *
 * @returns app, server, and io objects (if more configuration is required)
 */
const createPicoSocketServer = ({
  assetFilesPath,
  htmlGameFilePath,
  clientConfig,
}) => {
  // required "create the webserver" logic
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);

  // read in the html file now, so we can append some script tags for the client side JS
  const htmlFileData = fs.readFileSync(htmlGameFilePath);
  const htmlFileTemplate = htmlFileData.toString();

  // build script tags to inject in the head of the document
  const clientSideCode = `
      <script src="/socket.io/socket.io.js"></script>
      <script defer>
        const createPicoSocketClient = ${createPicoSocketClient.toString()}
        createPicoSocketClient(${JSON.stringify(clientConfig)})
      </script>
    </head>
  `;

  // add the client side code
  const modifiedTemplate = htmlFileTemplate.replace("</head>", clientSideCode);

  // host the static files
  app.use(express.static(path.join(process.cwd(), assetFilesPath)));
  app.use((__req, res) => {
    // by default serve the modified html game file
    return res.send(modifiedTemplate);
  });

  // host on port 5000
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () =>
    console.log(`Server Running http://localhost:${PORT}`)
  );

  // socket is a specific connection between the server and the client
  io.on("connection", (socket) => {
    // save a `roomId` variable for this socket connection
    // when sending / recieving data, it will only go to people in the same room
    let roomId;
    socket.on("disconnect", () => {});
    // attach a room id to the socket connection
    socket.on("room_join", (evtData) => {
      socket.join(evtData.roomId);
      roomId = evtData.roomId;

      // if DEBUG=true, log when clients join
      if (process.env.DEBUG) {
        console.log("client joined room: ", roomId);
      }
    });
    // when the server recives an update from the client, send it to every client with the same room id
    socket.on("update", (updatedData) => {
      socket.to(roomId).volatile.emit("update_from_server", updatedData);

      // if DEBUG=true, log the data we get
      if (process.env.DEBUG) {
        console.log(`${roomId}: `, updatedData);
      }
    });
  });

  // while these shouldn't be required, returning these variables for
  // any other config that might be required
  return { app, server, io };
};

module.exports = createPicoSocketServer;
