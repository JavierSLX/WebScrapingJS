const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = (url) => {
    return rp(url).then(html => {
        //Obtiene el dato de la clase llamada firstHeading
        return {name: cheerio('.firstHeading', html).text(), birthday: cheerio('.bday', html).text()};
    }).catch(error => {
        return error;
    });
};