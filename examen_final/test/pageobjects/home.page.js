const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomePage extends Page {
    /**
     * define selectors using getter methods
     */
    get btnSearch () { return $('.btn_search') }
    get btnLenguaje () { return $('label[for=language]') }
    get searchInput () { return $('#search-input') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    clickSearch () {
        
        this.btnSearch.click(); 
    }

     focusSearch () {
        this.btnLenguaje.click(); 
    }

    searchText () {
        this.btnLenguaje.click(); 
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open () {
        return super.open('/#');
    }
}

module.exports = new HomePage();
