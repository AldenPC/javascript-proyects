const HomePage = require('../pageobjects/home.page');
const nombre = "Maria";

describe('Punto 1 de examen', () => {
    beforeEach(()=>{
        HomePage.open();
    })
    it('El sitio no redirige a ninguna pagina.', () => {
        const currentUrl="https://develop.terapeutica.digital/#/";
        HomePage.clickSearch();
        expect(browser).toHaveUrl(currentUrl);
    });
    it('Búsqueda obtiene el foco y cambia a: Buscas a alguien o algo en especifico.', () => {
        HomePage.focusSearch();
        expect(HomePage.searchInput).toBeFocused();
        expect(HomePage.searchInput).toHaveAttribute('placeholder', "¿Buscas a alguien o algo en específico?");
    });
    it('Usuario es dirigido a la página de resultados y el primer resultado es un especialista con el nombre de Maria.', () => {
        HomePage.searchText();
        expect(browser).toHaveUrlContaining(nombre);
        expect(HomePage.firstResult).toHaveTextContaining(nombre);
    });
});



