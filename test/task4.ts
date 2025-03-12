import { By, WebDriver } from "selenium-webdriver";
import { buildDriver } from "../utils.js";
import { expect } from "chai";

describe("task4", () => {
  let driver: WebDriver;

  before(async () => {
    driver = await buildDriver();
  });

  after(async () => {
    await driver.quit();
  });

  it("Should remove first item from compare list after adding 5", async () => {
    await driver.get("https://demowebshop.tricentis.com/");
    expect(await driver.getTitle()).to.equal("Demo Web Shop");

    const books = [
      "Computing and Internet",
      "Copy of Computing and Internet EX",
      "Fiction",
      "Fiction EX",
      "Health Book",
    ];

    const previousBooks = [];

    for (const book of books) {
      await driver
        .findElement(
          By.xpath(
            "//div[contains(@class, 'block-category-navigation')]//a[contains(text(), 'Books')]"
          )
        )
        .click();

      expect(
        await driver.findElement(By.className("page-title")).getText()
      ).to.equal("Books");

      await driver
        .findElement(
          By.xpath(
            `//div[contains(@class, 'product-item')]//a[text()='${book}']`
          )
        )
        .click();

      expect(
        await driver
          .findElement(By.xpath("//input[@value='Add to cart']"))
          .isDisplayed()
      ).to.be.true;

      await driver
        .findElement(By.xpath("//input[@value='Add to compare list']"))
        .click();

      const compareProductsHeader = await driver.findElement(
        By.xpath("//h1[text()='Compare products']")
      );
      const productLinkInTable = await driver.findElement(
        By.xpath(`//table//a[text()='${book}']`)
      );

      expect(await compareProductsHeader.isDisplayed()).to.be.true;
      expect(await productLinkInTable.isDisplayed()).to.be.true;

      const productNames = await getProductNames(driver);
      if (previousBooks.length + 1 !== books.length) {
        expect(productNames).to.include.members(previousBooks);
      }

      previousBooks.push(book);
    }

    const productNames = await getProductNames(driver);

    expect(productNames).to.have.length(4);
    expect(productNames).not.to.contain(books[0]);
    for (let i = 1; i < books.length; ++i) {
      expect(productNames).to.contain(books[i]);
    }
  });
});

async function getProductNames(driver: WebDriver) {
  return await Promise.all(
    (
      await driver.findElements(
        By.xpath("//tr[contains(@class, 'product-name')]//a")
      )
    ).map((element) => element.getText())
  );
}
