const Nightmare = require("nightmare");

jest.setTimeout(20 * 1000);

describe("When visiting the page", () => {
  test("the page loads", async () => {
    const page = Nightmare({ show: true }).goto("http://localhost:5000");

    const title = await page.evaluate(() => document.title).end();

    expect(title).toContain("PICO-8 Cartridge");
  });

  test("gpio is populated on game startup", async () => {
    const page = Nightmare({ show: true })
      .goto("http://localhost:5000")
      .wait("#p8_start_button")
      .click("#p8_start_button")
      .wait(() => {
        return window.pico8_gpio[0] == 0;
      });

    const gpio = await page.evaluate(() => window.pico8_gpio).end();

    expect(gpio).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
  });

  test("gpio is updated on player joining", async () => {
    const page = Nightmare({ show: true })
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

    const gpio = await page.evaluate(() => window.pico8_gpio).end();

    expect(gpio[1]).toEqual(1);
    expect(gpio[2]).toEqual(1);
    expect(gpio[3]).toBeGreaterThan(0);
    expect(gpio[4]).toBeGreaterThan(0);
  });
});
