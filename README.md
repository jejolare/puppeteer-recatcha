# puppeteer-recatcha
Free, unlimited solution for automatic captcha solving in the browser with puppeteer. This package requires wit.ai API key (it's free).

<h2>Installation</h2>

```sh
npm install puppeteer-recatcha
```

<h2>Common Usage</h2>

```js
// I recommend using puppeteer-extra-plugin-stealths
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import solve from 'puppeteer-recaptcha';

puppeteer.use(StealthPlugin());
const API_KEY = ''; // Get it for free here: https://wit.ai/
(async () => {
    const browser = await puppeteer.launch({
        // headless: false,
        args: [
            '--disable-web-security', 
            '--disable-features=IsolateOrigins', 
            '--disable-site-isolation-trials'
        ] // these arguments are required
    });

    const page = await browser.newPage();
    await page.goto('https://store.steampowered.com/join'); // your link

    const result = await solve(page, API_KEY);
    console.log(result);
    
    // { solved: true, error: null }
    // or
    // {  solved: false, error: 'Error: Unable to...' }
})();
```
