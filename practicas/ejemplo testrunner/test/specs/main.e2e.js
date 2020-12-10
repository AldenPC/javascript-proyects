describe('Hoodoo carreer page', ()=>{

before(()=>{
    browser.url("/careers/");
})

    it ('It should show 4 different labels', ()=>{
        const title=$('h1 span.text-primary');
        expect(title).toHaveTextContaining('Remotely');
    });
});