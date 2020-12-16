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
    // it('Ultimo punto', () => {
    //     browser.url('https://develop.terapeutica.digital/#/search?q=Maria');
    //         browser.setupInterceptor(); 
    //         browser.expectRequest('POST', 'https://javito-stage.herokuapp.com/v1/specialists/search',200); 
    //         $('.strip_list > a').click() 
    //         browser.expectRequest('GET','https://javito-stage.herokuapp.com/v1/specialist/37378b04-4b69-452e-9fad-e83959388f41', 200);
    //         browser.pause(1000); 
    //         browser.assertRequests(); 
    // });
    it('El webservice correcto es llamado al ingresar a la página de detalles de perfil de un profesional.', () => {
        const mock = browser.mock('https://javito-stage.herokuapp.com/v1/specialist/37378b04-4b69-452e-9fad-e83959388f41')
        HomePage.searchText()
        ResultsPage.btnPerfil.click()
        expect(mock).toBeRequested()
    });
});




