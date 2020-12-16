const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ResultPage extends Page {
    /**
     * define selectors using getter methods
     */
    get firstResult () { return $('.col-lg-7 :first-child h3') }
    get btnFisica () { return $('//a[contains(text(),"Física")]') }
    get btnLenguaje () { return $('//a[contains(text(),"Lenguaje")]') }
    get btnOcupacional () { return $('//a[contains(text(),"Ocupacional")]') }
    get btnSearch () { return $('[value="Buscar"]') }
    get txtSearch () { return $('input[type="text"]') }
    get btnMap () { return $('.icon-map-1') }
    get googleMap () { return $('.google-map') }
    get btnList () { return $('.icon-th-list') }
    get btnPerfil () { return $('.btn_listing') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */

    clickPhisicalSpecialty(){
        this.btnFisica.click();
    }

    clickLanguageSpecialty(){
        this.btnLenguaje.click();
    }

    clickOcupationalSpecialty(){
        this.btnOcupacional.click();
    }

    resultsSearch(){
        this.txtSearch.setValue("Maria");
        this.btnSearch.click();
    }  

    resultsMapNotVisible(){
        this.txtSearch.setValue("Maria");
        this.btnSearch.click();
        this.btnMap.click();
    }  

    resultsMapVisible(){
        this.txtSearch.setValue("Maria");
        this.btnSearch.click();
        this.btnMap.click();
        this.btnList.click();
    }  

    /**
     * overwrite specifc options to adapt it to page object
     */
    open () {
        return super.open('/#');
    }
}

module.exports = new ResultPage();
