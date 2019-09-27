const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://github.com');
    await page.screenshot({path: 'github.png'});

    await browser.close();
})();