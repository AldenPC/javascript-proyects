const ResultsPage = require('../pageobjects/results.page');
const HomePage = require('../pageobjects/home.page');
const especialidad = ["phisical", "language", "ocupational"];
const nombre = "Maria";

describe('Punto 2 de examen', () => {
    beforeEach(()=>{
        HomePage.open();
    })
    it('Cambiar de especialidad se refleja en la URL (Física).', () => {
        HomePage.searchText();
        ResultsPage.clickPhisicalSpecialty();
        expect(browser).toHaveUrlContaining(especialidad[0]);
    });
    it('Cambiar de especialidad se refleja en la URL (Lenguaje).', () => {
        HomePage.searchText();
        ResultsPage.clickLanguageSpecialty();
        expect(browser).toHaveUrlContaining(especialidad[1]);
    });
    it('Cambiar de especialidad se refleja en la URL (Ocupacional).', () => {
        HomePage.searchText();
        ResultsPage.clickOcupationalSpecialty();
        expect(browser).toHaveUrlContaining(especialidad[2]);
    });
    it('Pagina es refrescada y el primer resultado es un especialista con el nombre de Maria.', () => {
        ResultsPage.resultsSearch();
        expect(HomePage.firstResult).toHaveTextContaining(nombre);
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




