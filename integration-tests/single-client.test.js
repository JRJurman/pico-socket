const Nightmare = require("nightmare");

jest.setTimeout(60 * 1000);

describe("When visiting the page", () => {
  test("the page loads", async () => {
    let page = Nightmare({ show: true }).goto("http://localhost:5000");

    let title = await page.evaluate().end();

    expect(title).toContain("PICO-8 Cartridge");
  });
  test("the game exists and can run", async () => {
    let page = Nightmare({ show: true })
      .goto("http://localhost:5000")
      .wait("#p8_start_button")
      .click("#p8_start_button");

    await page.wait(() => window.pico8_gpio[0] == 0).end();
  });
});
