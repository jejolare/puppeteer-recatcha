<h2>Common Usage</h2>
```js
    //I recommend using puppeteer-extra-plugin-stealths
    import puppeteer from 'puppeteer-extra';
    import StealthPlugin from 'puppeteer-extra-plugin-stealth';
    import solve from 'puppeteer-recaptcha';

    puppeteer.use(StealthPlugin());

    const API_KEY = 'YOUR_API_KEY'; // Get it for free here: https://wit.ai/

    (async () => {
        const browser = await puppeteer.launch({
            args: [
                '--disable-web-security', 
                '--disable-features=IsolateOrigins', 
                '--disable-site-isolation-trials'
            ] // these arguments are required
        });

        const page = await browser.newPage();
        await page.goto('https://store.steampowered.com/join');

        // These selectors are browser language dependent
        const captchaSelector = 'iframe[title="reCAPTCHA"]';
        const challengeSelector = 'iframe[title="recaptcha challenge"]';
        
        await page.waitForSelector(captchaSelector);
        await page.waitForSelector(challengeSelector);

        const captcha = await page.$(captchaSelector);
        const captchaChallenge = await page.$(challengeSelector);

        await solver(page, API_KEY, captcha, captchaChallenge);
    });
```
