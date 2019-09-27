const puppeteer = require('puppeteer');
const url = 'https://www.reddit.com';
const fs = require('fs');
const cheerio = require('cheerio');

//Cuando la pagina necesita de Javascript para mostrar contenido
let navegator;
puppeteer.launch().then(browser => {
    navegator = browser;
    return browser.newPage();
}).then(page => {
    return page.goto(url).then(() => {
        return page.content();
    });
}).then(html => {
    //Cierra el navegador
    navegator.close();
    fs.writeFileSync(__dirname + '/archivo.html', html);

    //Imprime cada etiqueta h3 del documento
    cheerio('h3', html).each(function() {
        console.log(cheerio(this).text());
    });
}).catch(error => {
    console.log(error);
});