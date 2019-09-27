const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

(async () => {
    //Instancia un navegador y una pagina para interactuar
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Coloca la url a navegar
    let url = 'https://stackoverflow.com';
    await page.goto(url, {waitUntil: 'load'});
    console.log('URL: ', page.url());

    //Coloca sobre la caja de texto con la clase llamada 'js-search-field' NodeJS y presiona Enter
    await page.type('.js-search-field', 'NodeJS');
    page.keyboard.press('Enter');

    //Se espera a que se abra la nueva pagina
    await page.waitForNavigation();

    //Nos muestra la nueva url
    console.log('New URL: ', page.url());
    
    //Obtiene las url de los contenidos en la lista
    let html = await page.content();
    let array = new Array();
    for(let i = 0; i < cheerio('h3 > .question-hyperlink', html).length; i++)
        array.push(cheerio('h3 > .question-hyperlink', html)[i].attribs.href)

    //Se dirige al primer enlace de la lista y captura una imagen
    await page.goto(url + array[0], {waitUntil: 'load'});
    console.log('New URL: ', page.url());
    await page.screenshot({path: 'stack.png'});

    //Guarda un pdf con el contenido de la pregunta
    await page.pdf({path: 'stack.pdf', format: 'A4'});

    browser.close();
})();