const ResultsPage = require('../pageobjects/results.page');
const HomePage = require('../pageobjects/home.page');

describe('Punto 2 de examen', () => {
    beforeEach(()=>{
        HomePage.open();
    })
    it('Cambiar de especialidad se refleja en la URL (Física).', () => {
        HomePage.searchText();
        ResultsPage.clickPhisicalSpecialty();
        expect(browser).toHaveUrlContaining("phisical");
    });
    it('Cambiar de especialidad se refleja en la URL (Lenguaje).', () => {
        HomePage.searchText();
        ResultsPage.clickLanguageSpecialty();
        expect(browser).toHaveUrlContaining("language");
    });
    it('Cambiar de especialidad se refleja en la URL (Ocupacional).', () => {
        HomePage.searchText();
        ResultsPage.clickOcupationalSpecialty();
        expect(browser).toHaveUrlContaining("ocupational");
    });
    it('Pagina es refrescada y el primer resultado es un especialista con el nombre de Maria.', () => {
        ResultsPage.resultsSearch();
        expect(HomePage.firstResult).toHaveTextContaining("Maria");
    });
    it('Al cambiar entre mapa y lista el mapa desaparece de la página.', () => {
        ResultsPage.resultsMapNotVisible();
        expect(ResultsPage.googleMap).not.toBeVisible();
    });
    it('Al cambiar entre mapa y lista el mapa aparece de la página.', () => {
        ResultsPage.resultsMapVisible();
        expect(ResultsPage.googleMap).toBeVisible();
    });
});


