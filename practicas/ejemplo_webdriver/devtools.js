const {remote} = require('webdriverio');

(async() => {
 const browser = await remote({
     //logLevel: 'trace',
    capabilities: {browserName: 'chrome'},
})
await browser.url('https://webdriver.io/docs/api.html');
const versionsBtn = await browser.$('=Versions');
await versionsBtn.click();
const dateLbl = await (await browser.$('.docLastUpdate em')).getText();
console.log('este es el valor: ' + dateLbl);
})().catch((e)=>console.error(e))

