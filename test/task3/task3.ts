import { By, until, WebDriver } from "selenium-webdriver";
import { Select } from "selenium-webdriver/lib/select.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { expect } from "chai";
import { buildDriver } from "../../utils.js";

const URL = "https://demowebshop.tricentis.com/";
const LOG_IN_LOCATOR = By.linkText("Log in");

describe("task3", () => {
  const globalBefore = async () => {
    driver = await buildDriver();
    await driver.get(URL);
    await driver.findElement(LOG_IN_LOCATOR).click();
  };
  const closeDriver = async () => {
    await driver?.quit();
    driver = undefined!;
  };
  let driver: WebDriver;
  let email: string;
  let password: string;

  before(async () => {
    await globalBefore();
    await driver
      .findElement(
        By.xpath(
          "//div[contains(@class, 'register-block')]//input[@value='Register']"
        )
      )
      .click();

    const userId = uuidv4();
    email = `test-${userId}@test.test`;
    password = crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);

    for (const [field, value] of [
      ["FirstName", `test user first ${userId}`],
      ["LastName", `test user last ${userId}`],
      ["Email", email],
      ["Password", password],
      ["ConfirmPassword", password],
    ])
      await driver.findElement(By.name(field)).sendKeys(value);
    await driver.findElement(By.xpath("//input[@value='Register']")).click();
    await driver
      .wait(until.elementLocated(By.xpath("//input[@value='Continue']")))
      .click();
    await closeDriver();
  });

  beforeEach(async () => {
    await globalBefore();
  });

  afterEach(async () => {
    await closeDriver();
  });

  after(async () => {
    await closeDriver();
  });

  [1, 2].forEach((i) => {
    it(`task3.${i}`, async () => {
      await driver.findElement(By.name("Email")).sendKeys(email);
      await driver.findElement(By.name("Password")).sendKeys(password);
      await driver.findElement(By.xpath("//input[@value='Log in']")).click();
      await driver.wait(until.urlIs(URL));
      await driver
        .findElement(
          By.xpath(
            "//div[contains(@class, 'block-category-navigation')]//a[contains(text(), 'Digital downloads')]"
          )
        )
        .click();

      const ajaxLoadingBlockWindow = await driver.findElement(
        By.className("ajax-loading-block-window")
      );
      const file = await fs.open(
        path.join(import.meta.dirname, `data${i}.txt`)
      );
      try {
        for await (const line of file.readLines()) {
          await driver
            .findElement(
              By.xpath(
                `//div[contains(@class, 'product-item') and .//a[text()='${line}']]//input[@value='Add to cart']`
              )
            )
            .click();
          await driver.wait(until.elementIsNotVisible(ajaxLoadingBlockWindow));
        }
      } finally {
        await file.close();
      }
      await driver.findElement(By.linkText("Shopping cart")).click();
      await driver.findElement(By.id("termsofservice")).click();
      await driver
        .findElement(By.xpath("//button[contains(text(), 'Checkout')]"))
        .click();
      if (i === 1) {
        await new Select(
          driver.wait(
            until.elementLocated(By.name("BillingNewAddress.CountryId"))
          )
        ).selectByVisibleText("Lithuania");
        for (const [field, value] of [
          ["BillingNewAddress.City", "Vilnius"],
          ["BillingNewAddress.Address1", "Didlaukio g. 47"],
          ["BillingNewAddress.ZipPostalCode", "LT-08303"],
          ["BillingNewAddress.PhoneNumber", "800-555-0175"],
        ])
          await driver.findElement(By.name(field)).sendKeys(value);
      }

      const clickContinue = async (className: string) => {
        const element = await driver.wait(
          until.elementLocated(By.className(className))
        );
        await driver.wait(until.elementIsVisible(element)).click();
      };

      await clickContinue("new-address-next-step-button");
      await clickContinue("payment-method-next-step-button");
      await clickContinue("payment-info-next-step-button");
      await clickContinue("confirm-order-next-step-button");
      const successText = await driver
        .wait(until.elementLocated(By.className("order-completed")))
        .getText();
      expect(successText).to.contain(
        "Your order has been successfully processed!"
      );
    });
  });
});
