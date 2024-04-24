const { Builder, By, until, Select } = require('selenium-webdriver');
const assert = require('assert');

describe('payment methods', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:9990/admin');
    // await driver.get('http://150.165.75.99:9990/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });

  // Remove .only and implement others test cases!
  it('tc1', async () => {
    // Click in payment methods in side menu
    await driver.findElement(By.linkText('Payment methods')).click();

    // Type in value input to search for specify payment method
    await driver.findElement(By.id('criteria_search_value')).sendKeys('cash');

    // Click in filter blue button
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    // Click in edit of the last payment method
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[buttons.length - 1].click();

    // Type 1 in position field
    await driver.findElement(By.id('sylius_payment_method_position')).sendKeys('1');

    // Click on Save changes button
    await driver.findElement(By.id('sylius_save_changes_button')).click();

    // Assert that payment method has been updated
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully updated.'));
  });

  it('tc2', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('bank_transfer')
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[buttons.length - 1].click();

    const checkbox = await driver.findElement(By.id('sylius_payment_method_enabled'));
    await driver.executeScript('arguments[0].click()', checkbox);

    await driver.findElement(By.id('sylius_save_changes_button')).click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully updated.'));
  });

  it('tc3', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();

    await driver.findElement(By.className('ui labeled icon top right floating dropdown button primary link')).click();
    await driver.findElement(By.id('offline')).click();

    await driver.findElement(By.id('sylius_payment_method_code')).sendKeys('credit_card')
    await driver.findElement(By.id('sylius_payment_method_position')).sendKeys('2')
    await driver.findElement(By.id('sylius_payment_method_translations_en_US_name')).sendKeys('Credit Card')

    await driver.findElement(By.className('ui labeled icon primary button')).click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully created.'));
  });


  it('tc4', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();

    // search for recently created element
    await driver.findElement(By.id('criteria_search_value')).sendKeys('credit_card')
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    const deleteButtons = await driver.findElements(By.css('*[class^="ui red labeled icon button"]'));
    await deleteButtons[deleteButtons.length - 1].click();

    await driver.findElement(By.id('confirmation-button')).click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully deleted.'));
  });

  it('tc5', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('bank_transfer')
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[buttons.length - 1].click();

    const nameInput = await driver.findElement(By.id('sylius_payment_method_translations_en_US_name'));

    nameInput.clear()
    nameInput.sendKeys('New Bank Transfer');

    await driver.findElement(By.id('sylius_save_changes_button')).click();

    var bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully updated.'));

    await driver.findElement(By.linkText('Payment methods')).click();
    bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('New Bank Transfer'));
  });

  it('tc6', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();

    await driver.findElement(By.className('ui labeled icon top right floating dropdown button primary link')).click();
    await driver.findElement(By.id('offline')).click();

    await driver.findElement(By.id('sylius_payment_method_code')).sendKeys('int_bank_transfer')
    await driver.findElement(By.id('sylius_payment_method_position')).sendKeys('3')
    await driver.findElement(By.id('sylius_payment_method_translations_en_US_name')).sendKeys('International Bank Transfer')

    await driver.findElement(By.className('ui labeled icon primary button')).click();

    var bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully created.'));

    await driver.findElement(By.linkText('Payment methods')).click();
    bodyText = await driver.findElement(By.tagName('body')).getText();

    assert(bodyText.includes('bank_transfer'));
    assert(bodyText.includes('int_bank_transfer'));
  });

  it('tc7', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();

    await driver.findElement(By.className('ui labeled icon top right floating dropdown button primary link')).click();
    await driver.findElement(By.id('stripe_checkout')).click();

    await driver.findElement(By.id('sylius_payment_method_code')).sendKeys('credit_card');
    await driver.findElement(By.id('sylius_payment_method_position')).sendKeys('4')

    await driver.findElement(By.id('sylius_payment_method_translations_en_US_name')).sendKeys('Credit Card')
    await driver.findElement(By.id('sylius_payment_method_translations_en_US_description')).sendKeys('Mastercard')

    const checkbox = await driver.findElement(By.id('sylius_payment_method_channels_0'));
    await driver.executeScript('arguments[0].click()', checkbox);

    await driver.findElement(By.id('sylius_payment_method_gatewayConfig_config_publishable_key')).sendKeys('12345')
    await driver.findElement(By.id('sylius_payment_method_gatewayConfig_config_secret_key')).sendKeys('54321')

    await driver.findElement(By.className('ui labeled icon primary button')).click();

    var bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully created.'));

    await driver.findElement(By.linkText('Payment methods')).click();
    bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('credit_card'));
  });

  it('tc8', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();

    await driver.findElement(By.className('ui labeled icon top right floating dropdown button primary link')).click();
    await driver.findElement(By.id('paypal_express_checkout')).click();

    await driver.findElement(By.id('sylius_payment_method_code')).sendKeys('pay_pal_checkout');
    await driver.findElement(By.id('sylius_payment_method_position')).sendKeys('5');
    await driver.findElement(By.id('sylius_payment_method_translations_en_US_name')).sendKeys('PayPal Checkout');

    await driver.findElement(By.id('sylius_payment_method_gatewayConfig_config_username')).sendKeys('testusername');
    await driver.findElement(By.id('sylius_payment_method_gatewayConfig_config_password')).sendKeys('testpassword');
    await driver.findElement(By.id('sylius_payment_method_gatewayConfig_config_signature')).sendKeys('testsignature');

    await driver.findElement(By.className('ui labeled icon primary button')).click();

    var bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully created.'));

    await driver.findElement(By.linkText('Payment methods')).click();
    bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('pay_pal_checkout'));
  });

  it('tc9', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();

    await driver.findElement(By.className('ui labeled icon top right floating dropdown button primary link')).click();
    await driver.findElement(By.id('offline')).click();

    await driver.findElement(By.id('sylius_payment_method_code')).sendKeys('int_credit_card');
    await driver.findElement(By.id('sylius_payment_method_position')).sendKeys('6');
    await driver.findElement(By.id('sylius_payment_method_translations_en_US_name')).sendKeys('International Credit Card');

    await driver.findElement(By.className('de flag')).click();

    await driver.findElement(By.id('sylius_payment_method_translations_de_DE_name')).sendKeys('(German) International Credit Card');

    await driver.findElement(By.className('ui labeled icon primary button')).click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully created.'));
  });

  it('tc10', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('card');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    const stringsIn = ['credit_card', 'int_credit_card']
    const stringsOut = ['bank_transfer', 'cash_on_delivery', 'int_bank_transfer', 'pay_pal_checkout']

    const stringsInBool = stringsIn.every(str => bodyText.includes(str));
    const stringsOutBool = stringsOut.every(str => bodyText.includes(str));

    assert(stringsInBool);
    assert(!stringsOutBool);
  });

  // Implement the remaining test cases in a similar manner
});
