const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
    try
    {
        //Instancia un navegador y una pagina para navegar (Las opciones es para poder ver como se maneja el navegador)
        //const browser = await puppeteer.launch({headless: false, slowMo: 100, devtools: false});
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        //Coloca la url a navegar
        let url = 'https://www.meteored.mx/';
        await page.goto(url, {waitUntil: 'load', timeout: 0});
        console.log('Portada: ', page.url());

        //Obtiene la informacion del enlace a Guanajuato
        let content = await page.content();
        let data = cheerio('li.li_hijos > a', content);
        let array = new Array();
        for(let i = 0; i < data.length; i++)
            array.push({nombre: data[i].attribs.title.trim(), enlace: data[i].attribs.href.trim()});

        let enlace = null;
        for(let i = 0; i < array.length; i++)
        {
            if(array[i].nombre == 'Clima en el Estado de Guanajuato')
            {
                enlace = array[i].enlace;
                break;
            }
        }

        if(enlace != null)
        {
            //Carga el enlace
            await page.goto(enlace, {waitUntil: 'load', timeout: 0});

            console.log('Guanaguato: ', page.url());
            
            //Obtiene los climas de la lista de Guanajuato
            content = await page.content();
            data = cheerio('li.li-top-prediccion > a', content);
            
            array = new Array();
            for(let i = 0; i < data.length; i++)
                array.push({nombre: data[i].attribs.title.trim(), direccion: data[i].attribs.href.trim()});

            //Saca los valores maximos
            await (async () => {
                cheerio('span.ddTemp > span.cMax', content).each(function(id, element) {
                    array[id].maxima = cheerio(this).text();
                });
            })();

            //Saca los valores minimos
            await (async () => {
                cheerio('span.ddTemp > span.cMin', content).each(function(id, element) {
                    array[id].minima = cheerio(this).text();
                });
            })();

            //Busca Salvatierra e imprime la temperatura
            let salvatierra = null;
            for(let i = 0; i < array.length; i++)
            {
                if(array[i].nombre == 'Clima en Salvatierra')
                {
                    salvatierra = array[i];
                    break;
                }
            }

            if(salvatierra != null)
                console.log(`En Salvatierra la temperatura máxima es ${salvatierra.maxima} y la mínima es ${salvatierra.minima}`);
            else
                console.log(`No existe Salvatierra en ${url}`);
        }
        else
        {
            console.log('Enlace a Guanajuato no encontrado');
        }

        //Cierra el navegador
        browser.close();
    }catch(error)
    {
        console.log(error);
    }
})();