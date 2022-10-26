# pico-socket

Server and Client library for adding Online Multiplayer to Pico-8

This Project borrows heavily (but simplifies) the logic in
Ethan Jurman's Pico Tiny Tanks - https://github.com/ethanjurman/pico-tiny-tanks

## What is it?

pico-socket is a library that allows multiple Pico-8 web clients (HTML export)
to talk to each other via websockets. Once the data has reached each client, it
is loaded in the Pico-8 environment using GPIO addresses.

While using pico-socket requires some configuration using Javascript, you are
do not need to write any javascript client or server code to get your game running!

![image](https://user-images.githubusercontent.com/326557/197946292-d650eb31-aaab-4c7b-bd58-1892cac37e02.png)


## How to Install / API

For this, you'll need Node JS, and Pico-8.

To start, make a new folder, and run the following in that new folder:

```
npm init --yes
npm i pico-socket
```

Export your game for the web (e.g. `export game.html`) and put your new game
files in the folder you just made (specifically your `.html` and `.js` export).

Create a `server.js` and call the `createPicoSocketServer`
(see the example in `sample/server.js` in this project). You'll need to pass in
the following information when you call the `createPicoSocketServer` function:

- `assetFilesPath` - where you game assets live (you can use `.` if they are in the same folder)
- `htmlGameFilePath` - the name of your html export
- `clientConfig` - an object with the following values:
  - `roomIdIndex` - the GPIO address index which dictates which other clients you should connect to
  - `playerIdIndex` - the GPIO address index which dictates which player this client is
  - `playerDataIndicies` - a list of indicies per-player, which dictates which GPIO addresses that player is responsible for.

Finally, run `node server.js` to kick off the server locally and play your game!
To test locally, it's possible to open two separate windows pointed to `localhost:5000` and have each client be a different player.
See the **Deployment** section below for more details.

If you want debugging information, you can run `DEBUG=true node server.js` to see the messages on the server and client logs.

## Simple Example

In your Pico-8 game, use GPIO addresses as a substitute for game state, using
`PEEK` and `POKE` to access data for the different players.

```lua
room_id_addr = 0x5f80 -- index 0
player_id_addr = 0x5f81 -- index 1
player_0_y_addr = 0x5f82 -- index 2
player_1_y_addr = 0x5f83 -- index 3

function _init()
  poke(room_id_addr, 0) -- hard code to 0
  poke(player_id_addr, 0) -- start as player 0
  poke(player_0_y_addr, 64)
  poke(player_1_y_addr, 64)
end

function _update()
  player_addr = 0
  if (peek(player_id_addr) == 1) player_addr = player_0_y_addr
  if (peek(player_id_addr) == 2) player_addr = player_1_y_addr

  -- move up and down
  cur_y = peek(player_addr)
  if (btn(⬆️)) poke(player_addr, cur_y-1)
  if (btn(⬇️)) poke(player_addr, cur_y+1)

  -- swap player id
  if (btnp(❎)) poke(player_id_addr, 0)
  if (btnp(🅾️)) poke(player_id_addr, 1)
end

function _draw()
  cls()
  rect(40, peek(player_0_y_addr), 44, peek(player_0_y_addr)+4, 12)
  rect(88, peek(player_1_y_addr), 92, peek(player_1_y_addr)+4, 8)
end
```

Create a `server.js` file next to your `.html` and `.js` export,
configured in the following way:

```js
const { createPicoSocketServer } = require("pico-socket");

createPicoSocketServer({
  assetFilesPath: ".",
  htmlGameFilePath: "./sample.html",

  clientConfig: {
    roomIdIndex: 0, // ROOM_ID

    // index to determine the player id
    playerIdIndex: 1, // PLAYER_ID

    // indicies that contain player specific data
    playerDataIndicies: [
      [2], // PLAYER_0_Y
      [3], // PLAYER_1_Y
    ],
  },
});
```

If you run the `server.js` using `node server.js`, you can navigate
to `localhost:5000` in two separate windows. If you press ❎ in one,
and 🅾️ in the other, you'll see that each window controls a separate
box.

## Deployment

Running this javascript file with NodeJS will start a server, that you can connect to. You can run this on your own hardware if you are familiar with setting up servers that other people can connect to (and most likely PORT FORWARDING). If you want, you can do LAN setups where people in the same area or VPN connect
to each other.

If you have a Github account and are familiar with creating Repositories, my recommendation is using a cloud
service like Heroku, which can fairly trivially deploy and host your project. See the Pong Example below
for a minimal repository setup that does just that!

## Pong Example

For a more complex example, check out https://github.com/JRJurman/pico-pong-online
