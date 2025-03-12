import { Browser, Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

// export const buildDriver = async () => {
//   const options = new chrome.Options();
//   // options.addArguments("--user-data-dir=./webdriver-data");
//   options.addArguments("--headless");
//   options.addArguments("--no-sandbox");
//   options.addArguments("--disable-dev-shm-usage");
//   options.addArguments("--window-size=1920x1080");
//   const driver = new Builder()
//     .forBrowser(Browser.CHROME)
//     .setChromeOptions(options)
//     .build();
//   await driver.manage().window().maximize();
//   return driver;
// };

export const buildDriver = async () => {
  const driver = new Builder().forBrowser(Browser.CHROME).build();
  await driver.manage().window().maximize();
  return driver;
};
