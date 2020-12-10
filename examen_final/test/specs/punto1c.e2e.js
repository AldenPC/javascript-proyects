
const HomePage = require('../pageobjects/home.page');

describe('Testing search with text Maria', () => {
    it('should show results for Maria', () => {
        HomePage.open();
        HomePage.searchText();
        expect(browser).toHaveUrlContaining("Maria");
        expect(HomePage.firstResult).toHaveTextContaining("Maria");
    });
});