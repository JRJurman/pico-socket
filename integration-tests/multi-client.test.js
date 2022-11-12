const Nightmare = require("nightmare");
// multiple imports of nightmare, so we can spawn multiple windows
const Nightmare2 = require("nightmare");

jest.setTimeout(20 * 1000);

describe("When handling multiple clients", () => {
  test("client loads player 1 data before joining", async () => {
    // launch for window and join the game
    const client1 = Nightmare({ show: true })
      .goto("http://localhost:5000")
      .wait("#p8_start_button")
      .click("#p8_start_button")
      .wait(() => {
        return window.pico8_gpio[0] == 0;
      })
      .evaluate(() => {
        // send ❎ to the client to join game
        SDL.receiveEvent({
          keyCode: 88,
          key: "x",
          code: "KeyX",
          charCode: 0,
          type: "keydown",
          which: 88,
        });
      })
      .end()
      .wait(() => {
        // expect the player id pin to be set to 1
        // and the player 1 joined pin to be set to 1
        const playerId = window.pico8_gpio[1];
        const player1Joined = window.pico8_gpio[2];

        return playerId == 1 && player1Joined == 1;
      });

    // launch a new client window
    const client2 = Nightmare2({ show: true })
      .goto("http://localhost:5000")
      .wait("#p8_start_button")
      .click("#p8_start_button")
      .wait(() => {
        return window.pico8_gpio[0] == 0;
      })
      .wait(() => {
        // expect the player id pin to be set to 0
        // and the player 1 joined pin to be set to 1
        const playerId = window.pico8_gpio[1];
        const player1Joined = window.pico8_gpio[2];

        return playerId == 0 && player1Joined == 1;
      });

    client1
      .evaluate(() => window.pico8_gpio)
      .then((gpio) => {
        // check that the first client's GPIO looks the way we expect
        expect(gpio[2]).toEqual(1);
        expect(gpio[3]).toBeGreaterThan(0);
        expect(gpio[4]).toBeGreaterThan(0);

        // we expect this player id to be 1, since this is the one we joined
        expect(gpio[1]).toEqual(1);
      });

    await client2
      .evaluate(() => window.pico8_gpio)
      .then((gpio) => {
        // check that the second client's GPIO looks the way we expect
        // (it should match the first players)
        expect(gpio[2]).toEqual(1);
        expect(gpio[3]).toBeGreaterThan(0);
        expect(gpio[4]).toBeGreaterThan(0);

        // we expect the player id to be 0 though (since we haven't joined)
        expect(gpio[1]).toEqual(0);
      });
  });

  test("first client loads player 2 data after joining", async () => {
    // launch for window and join the game
    const client1 = Nightmare({ show: true })
      .goto("http://localhost:5000")
      .wait("#p8_start_button")
      .click("#p8_start_button")
      .wait(() => {
        return window.pico8_gpio[0] == 0;
      })
      .evaluate(() => {
        // send ❎ to the client to join game
        SDL.receiveEvent({
          keyCode: 88,
          key: "x",
          code: "KeyX",
          charCode: 0,
          type: "keydown",
          which: 88,
        });
      })
      .end()
      .wait(() => {
        // expect the player id pin to be set to 1
        // and the player 1 joined pin to be set to 1
        const playerId = window.pico8_gpio[1];
        const player1Joined = window.pico8_gpio[2];

        return playerId == 1 && player1Joined == 1;
      });

    // launch a new client window
    const client2 = Nightmare2({ show: true })
      .goto("http://localhost:5000")
      .wait("#p8_start_button")
      .click("#p8_start_button")
      .wait(() => {
        return window.pico8_gpio[0] == 0;
      })
      .wait(() => {
        // expect the player id pin to be set to 0
        // and the player 1 joined pin to be set to 1
        const playerId = window.pico8_gpio[1];
        const player1Joined = window.pico8_gpio[2];

        return playerId == 0 && player1Joined == 1;
      })
      .evaluate(() => {
        // send ❎ to the client to join game
        SDL.receiveEvent({
          keyCode: 88,
          key: "x",
          code: "KeyX",
          charCode: 0,
          type: "keydown",
          which: 88,
        });
      })
      .end()
      .wait(() => {
        // expect the player id pin to be set to 2
        const playerId = window.pico8_gpio[1];
        return playerId == 2;
      });

    client2
      .evaluate(() => window.pico8_gpio)
      .then((gpio) => {
        // check that the second client's GPIO looks the way we expect
        expect(gpio[1]).toEqual(2);
        expect(gpio[5]).toEqual(1);
        expect(gpio[6]).toBeGreaterThan(0);
        expect(gpio[7]).toBeGreaterThan(0);
      });

    await client1
      .evaluate(() => window.pico8_gpio)
      .then((gpio) => {
        // check that the first client's GPIO looks the way we expect
        expect(gpio[1]).toEqual(1);
        expect(gpio[2]).toEqual(1);
        expect(gpio[3]).toBeGreaterThan(0);
        expect(gpio[4]).toBeGreaterThan(0);

        // player 2 should have joined
        expect(gpio[5]).toEqual(1);
        expect(gpio[6]).toBeGreaterThan(0);
        expect(gpio[7]).toBeGreaterThan(0);
      });
  });
});
