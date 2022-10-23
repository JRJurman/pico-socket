const createPicoSocketClient = ({
  roomIdIndex,
  playerIdIndex,
  playerDataIndicies,
}) => {
  const socket = io();

  let playerId = null;

  // every 250ms check the room id from GPIO
  // (we won't start reading / writing to other players
  //  until we have a room id)
  const roomCodeInterval = setInterval(() => {
    if (window.pico8_gpio[roomIdIndex]) {
      clearInterval(roomCodeInterval);
      socket.emit("room_join", {
        roomId: window.pico8_gpio[roomIdIndex],
      });
      window.requestAnimationFrame(onFrameUpdate);
    }
  }, 250);

  // on every frame send updates to the server about our data from gpio
  function onFrameUpdate() {
    // check to see if we have a playerId
    if (window.pico8_gpio[playerIdIndex] !== undefined) {
      playerId = window.pico8_gpio[playerIdIndex];
    }
    // make a copy of the GPIO array, we will update this to send out to clients
    const gpioForUpdate = new Array(128);

    // write player specific data for update
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
    // if we haven't picked a player (we are not in a game), then return immediately
    if (playerId === null) {
      return;
    }
    // for all of the data we have
    updatedData.forEach((updatedValue, gpioIndex) => {
      if (updatedValue != null) {
        window.pico8_gpio[gpioIndex] = updatedValue;
      }
    });
  });
};

module.exports = createPicoSocketClient;
