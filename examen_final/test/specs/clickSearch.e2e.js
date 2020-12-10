const HomePage = require('../pageobjects/home.page');
//const SecurePage = require('../pageobjects/secure.page');

describe('Click search without text', () => {
    it('should do nothing without text', () => {
        HomePage.open();
        const currentUrl="https://develop.terapeutica.digital/#/";
        HomePage.clickSearch();
        expect(browser).toHaveUrl(currentUrl);
    });
});


describe('Checking focus of search text', () => {
    it('focus should be in text search', () => {
        HomePage.open();
        HomePage.focusSearch();
        expect(HomePage.searchInput).toBeFocused();
        expect(HomePage.searchInput).toHaveAttribute('placeholder', "¿Buscas a alguien o algo en específico?");
    });
});




