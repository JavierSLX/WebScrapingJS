const puppeteer = require('puppeteer');

(async () => {
    try
    {
        //Instancia un navegador y una pagina para navegar (Las opciones es para poder ver como se maneja el navegador)
        const browser = await puppeteer.launch({headless: false, slowMo: 100, devtools: false});
        const page = await browser.newPage();

        //Coloca la url a navegar
        let url = 'https://www.etoro.com/es/login';
        await page.goto(url, {waitUntil: 'load'});
        console.log('Login: ', page.url());

        //Llena las casilla con datos y quita el checkbox
        await page.type('#username', 'XXXXX');
        await page.type('#password', 'XXXXXXXX');
        await page.click('#CB');

        //Regresa el focus a contraseña y da enter
        await page.focus('#password');
        page.keyboard.press('Enter');

        //Se espera a que se abra la nueva pagina
        await page.waitForNavigation();
        await page.screenshot({path: 'etoro.png'});
        browser.close();
    }catch(error)
    {
        console.log(error);
    }
})();