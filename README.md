# pico-socket

Server and Client code for adding Online Multiplayer to your Pico-8 Games

This Project borrows heavily (but simplifies) the logic in
Ethan Jurman's Pico Tiny Tanks - https://github.com/ethanjurman/pico-tiny-tanks

## What is it?

Pico Socket is Server and Client code so that you can have interactive online
multiplayer in your Pico-8 games. This is accomplished by using Pico-8's GPIO
as a way to write and read data from other players.

This Library works off of the default HTML export for Pico-8 games. While it
requires very little Javascript to configure, it does depend on a server (or
local computer) to run the game in a way that other people can connect to it.

## How to Use

NOTE: This project makes a lot of assumptions about how your game will work, what
kinds of data you'll want to manage, and how you want to manage it. While we believe
this interface is generic in a way that it should meet most games needs, feel free
to copy and change this code for whatever purposes your game may have! If you have a
use-case that you believe is generic and benefitical, feel free to make a suggestion
in the Issues tab here, or if possible, make a PR with your suggested improvement!

### Pong Example

For this, we'll use a simple Pong game as an example of how to use pico-socket.
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

### Game Logic

```
npm install pico-socket
```
