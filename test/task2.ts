import { expect } from "chai";
import { Browser, Builder, By, until, WebDriver } from "selenium-webdriver";

// const URL = "https://demoqa.com/";
const URL = "https://web.archive.org/web/20250112093337/http://demoqa.com/";

describe("Task 2", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().window().maximize();
    await driver.get(URL);
  }).timeout(60000);

  afterEach(async () => {
    // await driver.quit();
  });

  // it("Task 2.1", async () => {
  //   await driver
  //     .findElement(
  //       By.xpath("//div[contains(@class, 'top-card') and .//text()='Widgets']")
  //     )
  //     .click();
  //   const progressBarItem = driver.findElement(
  //     By.xpath("//span[text()='Progress Bar']")
  //   );
  //   await driver.executeScript(
  //     "arguments[0].scrollIntoView()",
  //     progressBarItem
  //   );
  //   await progressBarItem.click();
  //   await driver.executeScript("scrollTo(0, 0)");
  //   await driver.findElement(By.xpath("//button[text()='Start']")).click();
  //   await driver.wait(
  //     until.elementLocated(
  //       By.xpath("//div[@role='progressbar' and @aria-valuenow='100']")
  //     )
  //   );
  //   await driver.findElement(By.xpath("//button[text()='Reset']")).click();
  //   const progressBarState = await driver
  //     .findElement(By.xpath("//div[@role='progressbar']"))
  //     .getText();
  //   expect(progressBarState).to.equal("0%");
  // });

  it("Task 2.2", async () => {
    await driver
      .findElement(
        By.xpath("//div[contains(@class, 'top-card') and .//text()='Elements']")
      )
      .click();
    await driver.findElement(By.xpath("//span[text()='Web Tables']")).click();
    while (true) {
      const totalPages = await driver
        .findElement(By.className("-totalPages"))
        .getText();
      if (totalPages === "2") break;
      await driver.findElement(By.xpath("//button[text()='Add']")).click();
      await driver
        .findElement(By.xpath("//input[@placeholder='First Name']"))
        .sendKeys("test");
      await driver
        .findElement(By.xpath("//input[@placeholder='Last Name']"))
        .sendKeys("test");
      await driver
        .findElement(By.xpath("//input[@placeholder='name@example.com']"))
        .sendKeys("test@test.test");
      await driver
        .findElement(By.xpath("//input[@placeholder='Age']"))
        .sendKeys(0);
      await driver
        .findElement(By.xpath("//input[@placeholder='Salary']"))
        .sendKeys(0);
      await driver
        .findElement(By.xpath("//input[@placeholder='Department']"))
        .sendKeys("test");
      await driver.findElement(By.xpath("//button[text()='Submit']")).click();
      await driver.sleep(100);
    }
    const nextButton = driver.findElement(By.xpath("//button[text()='Next']"));
    await driver.executeScript("arguments[0].scrollIntoView()", nextButton);
    await nextButton.click();
    await driver.executeScript("scrollTo(0, 0)");
    await driver.findElement(By.xpath("(//span[@title='Delete'])")).click();
    const totalPages = await driver
      .findElement(By.className("-totalPages"))
      .getText();
    expect(totalPages).to.equal("1");
  });
});
