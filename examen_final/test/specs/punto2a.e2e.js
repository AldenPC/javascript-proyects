//const { focusSearch, clickSearch } = require('../pageobjects/home.page');
const ResultsPage = require('../pageobjects/results.page');

describe('Testing url changes when clicking different specialties', () => {
    it('url should change after changing specialty', () => {
        HomePage.open();
        HomePage.searchText();
        HomePage.clickPhisicalSpecialty();
        expect(browser).toHaveUrlContaining("phisical");
        HomePage.searchText();
        HomePage.clickLanguageSpecialty();
        expect(browser).toHaveUrlContaining("language");
        HomePage.searchText();
        HomePage.clickOcupationalSpecialty();
        expect(browser).toHaveUrlContaining("ocupational");
    });
});


