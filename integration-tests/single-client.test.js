const Nightmare = require("nightmare");

jest.setTimeout(60 * 1000);

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
});
