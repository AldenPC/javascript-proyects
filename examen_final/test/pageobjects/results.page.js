const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomePage extends Page {
    /**
     * define selectors using getter methods
     */
    get firstResult () { return $('.col-lg-7 :first-child h3') }
    get btnFisica () { return $('//a[contains(text(),"Física")]') }
    get btnLenguaje () { return $('//a[contains(text(),"Lenguaje")]') }
    get btnOcupacional () { return $('//a[contains(text(),"Ocupacional")]') }

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

    clickPhisicalSpecialty(){
        //this.btnSearch.click(); 
        this.btnFisica.click();
    }

    clickLanguageSpecialty(){
        //this.btnSearch.click(); 
        this.btnFisica.click();
    }

    clickOcupationalSpecialty(){
        //this.btnSearch.click(); 
        this.btnFisica.click();
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open () {
        return super.open('/#');
    }
}

module.exports = new HomePage();
