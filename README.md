# pico-socket

Server and Client library for adding Online Multiplayer to Pico-8

This Project borrows heavily (but simplifies) the logic in
Ethan Jurman's Pico Tiny Tanks - https://github.com/ethanjurman/pico-tiny-tanks

## What is it?

pico-socket is a library that allows multiple Pico-8 web clients (HTML export)
to talk to each other via websockets. The communication between clients is done
using Pico-8's GPIO addresses.

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

## Pong Example

For a more complex example, here is a Pong game as an example of how to use pico-socket.
We have the following data:

| Variable   | GPIO Address | Pico-Socket Index |
| ---------- | ------------ | ----------------- |
| PLAYER_ID  | 0x5f80       | 0                 |
| ROOM_ID    | 0x5f81       | 1                 |
| SCORE_1    | 0x5f82       | 2                 |
| SCORE_2    | 0x5f83       | 3                 |
| PLAYER_1_Y | 0x5f84       | 4                 |
| PLAYER_2_Y | 0x5f85       | 5                 |
| BALL_X_POS | 0x5f86       | 6                 |
| BALL_X_SPD | 0x5f87       | 7                 |
| BALL_Y_POS | 0x5f88       | 8                 |
| BALL_Y_SPD | 0x5f89       | 9                 |

- The `PLAYER_ID` is the selected player in a single game instance (either `1` or `2`).
- `ROOM_ID` is a unique value that separates players into isolated sessions
- `SCORE_1` and `SCORE_2` are the values for the two players
- `PLAYER_1_Y` and `PLAYER_2_Y` are each player's paddle position in the game
- `BALL_X_POS`, `BALL_X_SPD`, `BALL_Y_POS`, and `BALL_Y_SPD` are values for describing the moving ball

The `ROOM_ID` and `PLAYER_ID` are unique in that they change the behavior of the server. The `ROOM_ID`
when set will establish a connection to the server so that it can communicate with other clients in the
same `ROOM_ID`. `PLAYER_ID` determines what other data we will send to the other clients.

Functionally, we want each player to be responsible for their own data (Player 1 should never read
their position from another player, and similarly, should not be responsible for sending Player 2's position).
We also want a single player to be responsible for general game state (so there is no conflict on who should
resolve the final game state).

So, in pico-socket we have indicies associated with each player that determine what data they should send.
We have `PLAYER_2_Y` associated with the Player 2, and we have `PLAYER_1_Y` associated with Player 1. Additionally
we have all the game state associated with Player 1 (the score and ball data). This makes Player 1 the source
of truth in what data should be presented to both clients.
