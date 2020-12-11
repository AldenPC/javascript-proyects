const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomePage extends Page {
    /**
     * define selectors using getter methods
     */
    get btnSearch () { return $('.btn_search') }
    get btnOcupational () { return $('label[for=ocupational]') }
    get searchInput () { return $('#search-input') }
    get firstResult () { return $('.col-lg-7 :first-child h3') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    clickSearch () {
        
        this.btnSearch.click(); 
    }

     focusSearch () {
        this.btnOcupational.click(); 
    }

    searchText () {
        this.searchInput.setValue("Maria"); 
        this.btnSearch.click(); 
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open () {
        return super.open('/#');
    }
}

module.exports = new HomePage();
