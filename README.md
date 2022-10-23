# pico-socket

Server and Client code for adding Online Multiplayer to your Pico 8 Games

This Project borrows heavily (but simplifies) the logic in
Ethan Jurman's Pico Tiny Tanks - https://github.com/ethanjurman/pico-tiny-tanks

## What is it?

Pico Socket is Server and Client code so that you can have interactive online
multiplayer in your pico 8 games. This is accomplished by using Pico-8's GPIO
as a way to write and read data from other players.

The logic in this library prefixes the html file exported from your Pico-8 game
to include code that will communicate GPIO data to all players via websockets.

## How to Use

```
npm install pico-socket
```
