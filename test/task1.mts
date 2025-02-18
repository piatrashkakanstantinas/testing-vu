import { Browser, Builder, By, until, WebElement } from "selenium-webdriver";
import { Select } from "selenium-webdriver/lib/select.js";
import { expect } from "chai";

const driver = new Builder().forBrowser(Browser.CHROME).build();

class ProductItem {
  constructor(private readonly element: WebElement) {}

  async getActualPrice() {
    const priceString = await this.element
      .findElement(By.className("actual-price"))
      .getText();
    return Number(priceString);
  }

  async getTitle() {
    return await this.element
      .findElement(By.className("product-title"))
      .getText();
  }

  async open() {
    await this.element.findElement(By.className("picture")).click();
  }
}

const openCategory = async (category: string) => {
  await driver
    .findElement(By.className("block-category-navigation"))
    .findElement(By.linkText(category))
    .click();
};

const getProductItem = async (
  condition: (arg: ProductItem) => Promise<boolean>
) => {
  const elements = await driver.findElements(By.className("product-item"));
  for (const element of elements) {
    const productItem = new ProductItem(element);
    if (await condition(productItem)) return productItem;
  }
  throw new Error("Condition not satisfied");
};

const fillGiftCardForm = async () => {
  await driver.findElement(By.className("recipient-name")).sendKeys("test");
  await driver.findElement(By.className("sender-name")).sendKeys("test");
};

const setQuantity = async (quantity: number) => {
  const element = driver.findElement(By.className("qty-input"));
  await element.clear();
  await element.sendKeys(quantity);
};

const addToCartPanelLocator = By.className("add-to-cart-panel");

const clickAddToCartPanelButton = async (button: string) => {
  const loadingBlockWindow = driver.findElement(
    By.className("ajax-loading-block-window")
  );
  await driver
    .findElement(addToCartPanelLocator)
    .findElement(By.xpath(`//input[@value='${button}']`))
    .click();
  await driver.wait(until.elementIsNotVisible(loadingBlockWindow));
};

const addToCart = async () => {
  await clickAddToCartPanelButton("Add to cart");
};

const addToWishlist = async () => {
  await clickAddToCartPanelButton("Add to wishlist");
};

const closeBarNotification = async () => {
  await driver
    .findElement(By.id("bar-notification"))
    .findElement(By.className("close"))
    .click();
};

const getAttribute = (label: string) => {
  return driver.findElement(
    By.xpath(
      `(//*[./*[contains(text(), '${label}')]]/following-sibling::*)[1]/*`
    )
  );
};

const fillJewelryForm = async () => {
  await new Select(getAttribute("Material")).selectByVisibleText(
    "Silver (1 mm)"
  );
  await getAttribute("Length in cm").sendKeys(80);
  await getAttribute("Pendant")
    .findElement(By.xpath("//label[contains(text(), 'Star')]"))
    .click();
};

(async () => {
  try {
    await driver.get("https://demowebshop.tricentis.com/");
    await driver.manage().window().maximize();

    await openCategory("Gift Cards");
    // await (
    //   await getProductItem(
    //     async (productItem) => (await productItem.getActualPrice()) > 99
    //   )
    // ).open();
    await driver
      .findElement(
        By.xpath(
          "//div[contains(@class, 'product-item') and .//span[contains(@class, 'actual-price')]>99]/div[contains(@class, 'picture')]"
        )
      )
      .click(); // in case he asks for it
    await fillGiftCardForm();
    await setQuantity(5000);
    await addToCart();
    await addToWishlist();

    // await closeBarNotification(); // "Added to wish list" notification may obfuscate view
    await openCategory("Jewelry");
    await (
      await getProductItem(
        async (productItem) =>
          (await productItem.getTitle()) === "Create Your Own Jewelry"
      )
    ).open();
    await fillJewelryForm();
    await setQuantity(26);
    await addToCart();
    await addToWishlist();

    // await closeBarNotification(); // "Added to wish list" notification may obfuscate view
    await driver
      .findElement(By.className("header-links"))
      .findElement(By.partialLinkText("Wishlist"))
      .click();

    const checkboxes = await driver.findElements(By.name("addtocart"));
    for (const checkbox of checkboxes) {
      await checkbox.click();
    }
    await driver.findElement(By.name("addtocartbutton")).click();
    expect(await getAttribute("Sub-Total").getText()).to.equal("1002600.00");
    console.log("Test successfully passed");
  } finally {
    // driver.quit();
  }
})();
