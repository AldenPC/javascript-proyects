const HomePage = require('../pageobjects/home.page');

describe('Click search without text', () => {
    it('should do nothing without text', () => {
        HomePage.open();
        const currentUrl="https://develop.terapeutica.digital/#/";
        HomePage.clickSearch();
        expect(browser).toHaveUrl(currentUrl);
    });
});

