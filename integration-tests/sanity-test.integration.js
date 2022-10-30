describe("Sanity Test", () => {
  test("Server should host page with game", () => {
    browser.waitForElementVisible("#p8_start_button").click("#p8_start_button");
  });
});
