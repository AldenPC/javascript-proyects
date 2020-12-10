const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get btnSearch () { return $('.btn_search') }
    //get inputPassword () { return $('#password') }
    //get btnSubmit () { return $('button[type="submit"]') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    clickSearch () {
        //this.inputUsername.setValue(username);
        //this.inputPassword.setValue(password);
        this.btnSearch.click(); 
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open () {
        return super.open('https://develop.terapeutica.digital/#/');
    }
}

module.exports = new LoginPage();
