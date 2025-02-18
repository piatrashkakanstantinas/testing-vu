import { Browser, Builder, WebDriver } from "selenium-webdriver";

describe("Task 2", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = new Builder().forBrowser(Browser.CHROME).build();
    await driver.get("https://demoqa.com/");
  });

  afterEach(async () => {
    await driver.quit();
  });

  it("Task 2.1", () => {});

  it("Task 2.2", () => {});
});
