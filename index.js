const rp = require('request-promise');
const $ = require('cheerio');
const presidents = require('./presidents');
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';

rp(url).then(html => {
    
    //Obtenemos las urls de los presidentes
    let wikiUrls = new Array();
    let n = $('big > a', html).length;
    for(let i = 0; i < n; i++)
        wikiUrls.push($('big > a', html)[i].attribs.href);

    //Resuelve todas las promesas que obtiene
    return Promise.all(wikiUrls.map(url => {
        return presidents('https://en.wikipedia.org' + url);
    }));
}).then(result => {
    console.log(result);
}).catch(error => {
    console.log(error);
});