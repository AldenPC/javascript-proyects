const homePage = require('../pageobjects/homePage');
//const SecurePage = require('../pageobjects/secure.page');

describe('My Login application', () => {
    it('Testing Search button without any text in it', () => {
        homePage.open();

        homePage.clickSearch();
        //expect(SecurePage.flashAlert).toBeExisting();
        //expect(SecurePage.flashAlert).toHaveTextContaining(
            //'You logged into a secure area!');
    });
});


