const HomePage = require('../pageobjects/home.page');

describe('Checking focus of search text', () => {
    it('focus should be in text search', () => {
        HomePage.open();
        HomePage.focusSearch();
        expect(HomePage.searchInput).toBeFocused();
        expect(HomePage.searchInput).toHaveAttribute('placeholder', "¿Buscas a alguien o algo en específico?");
    });
});