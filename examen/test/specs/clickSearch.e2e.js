const { searchBar } = require('../pageobjects/click.search');
const homePage = require('../pageobjects/click.search');
const HomePage = require('../pageobjects/click.search');
//const SecurePage = require('../pageobjects/secure.page');

describe('Clicking Search without text', () => {
    it('should do nothing', () => {
        HomePage.open();
        HomePage.clickSearch();
        const currentUrl="https://develop.terapeutica.digital/#/";
        expect(browser).toHaveUrl(currentUrl);
    });
});


