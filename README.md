# pico-socket

A simple library for adding Online Multiplayer in pico-8

## What is it?

pico-socket is a library that allows multiple pico-8 web clients (HTML export)
to talk to each other via websockets. pico-socket only requires a simple config,
no additional coding outside of your game, and is flexible for most game types.

## How to Use

### Requirements

- NodeJS - https://nodejs.org/en/
- pico-8 - https://www.lexaloffle.com/pico-8.php

### pico-8 interface

In order for pico-socket to work, you need to read and write values to
[GPIO pins](https://pico-8.fandom.com/wiki/GPIO) in your pico-8 game.

One of these pins needs to be reserved for a room id, which determines which clients
can talk to who. Only players in the same room will share state.

Another pin needs to be reserved for the player id. This will be used for determing which
pins this player is responsible for updating.

After that, you are welcome to use the pins however you like. You can store
general game state, player information, whatever you want!

_Note: Values must be 0-255, they can not be negative, and if they would go beyond those values, they will loop around._

For example, you may reserve pins in the following way:

| 0x5f80  | 0x5f81    | 0x5f82     | 0x5f83     | 0x5f84     | 0x5f85     |
| ------- | --------- | ---------- | ---------- | ---------- | ---------- |
| room id | player id | player 1 x | player 1 y | player 2 x | player 2 y |

### pico-socket interface

Export your game for the web (e.g. `export game.html`) and put the exported
files in a folder by themselves (the generated html and js file).

In that folder, create a `pico-socket.yml` that has the following data:

- `roomIdIndex` - the GPIO pin index which dictates which other players you can connect to
- `playerIdIndex` - the GPIO pin index which dictates which player this is
- `playerDataIndicies` - a list of indicies per-player, which dictates which GPIO pins that player is responsible for

Using the above example again, you might configure pico-socket in the following way:

```yaml
roomIdIndex: 0 # 0x5f80
playerIdIndex: 1 # 0x5f81
playerDataIndicies:
  - [] # no data for player 0
  - [2, 3] # 0x5f82 and 0x5f83 - player 1 X and Y position
  - [4, 5] # 0x5f84 and 0x5f85 - player 2 X and Y position
```

This would tell pico-socket that if the playerId was `1`, we should send whatever data they have in `0x5f82` and `0x5f83`.
Player 2 would take in those values, and it's GPIO pins would be updated whenever player 1 changed them.

### Running the game

In our folder, we should have an html file, a js file, and a `pico-socket.yml`.
Now we can run the following command:

```
npx pico-socket
```

This will kick off a server on `localhost:5000`. Navigate to that address, and you should see your game!
You can open this address in multiple windows, and they should all be able to interact with each other.

### Deployment

If you want to deploy a project to a cloud service (like heroku),
you can create a package.json for your project with the following command:

```
npx pico-socket --package
```

This will create a package.json with the appropriate scripts.
From there, you can push your project to github and point to
heroku, or whatever cloud service you are familiar with.

## Sample

Included in this repo is a simple project that you can look at as a reference.

## Pong Example

For a more complex example, check out https://github.com/JRJurman/pico-pong-online

## Architecture

![Architecture Diagram](https://user-images.githubusercontent.com/326557/197959119-7de47927-6b2f-470d-98ab-ce4c258a68f1.png)

## Credits

This Project borrows heavily (but simplifies) the logic in
Ethan Jurman's Pico Tiny Tanks - https://github.com/ethanjurman/pico-tiny-tanks

Special shout-outs go to Tina Howard and Randy Goodman who also helped
contribute to the initial examples and interface for pico-socket
