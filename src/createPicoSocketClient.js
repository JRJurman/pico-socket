const createPicoSocketClient = ({
  roomIdIndex,
  playerIdIndex,
  playerDataIndicies,
}) => {
  const socket = io();

  // every 250ms check the room id from GPIO
  // (we won't start reading / writing to other players
  //  until we have a room id)
  const roomCodeInterval = setInterval(() => {
    const roomId = window.pico8_gpio[roomIdIndex];
    if (roomId != undefined) {
      console.log("client joined room: ", roomId);
      clearInterval(roomCodeInterval);
      socket.emit("room_join", { roomId });
      window.requestAnimationFrame(onFrameUpdate);
    }
  }, 250);

  // on every frame send updates to the server about our data from gpio
  function onFrameUpdate() {
    // get playerId from the specified index
    const playerId = window.pico8_gpio[playerIdIndex];

    // make a copy of the GPIO array, we will update this to send out to clients
    const gpioForUpdate = new Array(128);

    // get the indicies that this player is responsible
    // and update the `gpioForUpdate` to include that data
    const playerIndicies = playerDataIndicies[playerId] || [];
    playerIndicies.forEach((gpioIndex) => {
      gpioForUpdate[gpioIndex] = window.pico8_gpio[gpioIndex];
    });

    // send data to server (volatile means unsent data can be dropped)
    socket.volatile.emit("update", gpioForUpdate);

    // queue this function to run again (when the next animation frame is available)
    // this queuing should help prevent overwhelming the browser with requests
    setTimeout(() => {
      window.requestAnimationFrame(onFrameUpdate);
    }, 0);
  }

  // when we get other data from the server, set our gpio so pico8 can read it
  socket.on("update_from_server", (updatedData) => {
    // for all of the data we have
    updatedData.forEach((updatedValue, gpioIndex) => {
      if (updatedValue != undefined) {
        window.pico8_gpio[gpioIndex] = updatedValue;
      }
    });
  });
};

module.exports = createPicoSocketClient;
