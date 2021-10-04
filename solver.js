import fetch from "node-fetch";

export default async function solve(page, API_KEY, mainCaptchaElement, challengeCaptchaElement) {
    try {

        const frame = await mainCaptchaElement.contentFrame();
        await frame.waitForSelector('#recaptcha-anchor', { timeout: 4000 });
        await frame.click('#recaptcha-anchor');
    
        const captchaChallengeFrame = await challengeCaptchaElement.contentFrame();
        await captchaChallengeFrame.evaluate(() => {
            return new Promise((res, rej) =>  {
                setTimeout(() => rej(), 4000);
                setInterval(() => {
                    if (document.querySelector('#recaptcha-audio-button')) res();
                }, 100); 
            });
        });
    
        captchaChallengeFrame.click('#recaptcha-audio-button');
        const audio = await captchaChallengeFrame.evaluate(async () => {
            await new Promise((res, rej) => {
                setTimeout(() => rej(), 4000);
                setInterval(() => {
                    if (document.querySelector('.rc-audiochallenge-tdownload-link')) res();
                }, 100)
            });
            const link = document.querySelector('.rc-audiochallenge-tdownload-link').getAttribute('href'); 
            const response = await window.fetch(link);
            const buffer = await response.arrayBuffer();
            return Array.from(new Uint8Array(buffer));
        });
    
        const response = await fetch('https://api.wit.ai/speech', {
            method: 'POST', 
            body: new Uint8Array(audio).buffer,
            headers: {
                Authorization: 'Bearer ' + API_KEY,
                'Content-Type': 'audio/mpeg3'
            }
        });
    
        const text = await response.text();
        const result = JSON.parse(`{ "entities"${text.split('"entities"')[1]}`).text; // This API is broken, the response has to be parsed like this
        await captchaChallengeFrame.type('#audio-response', result);
        await page.waitForTimeout(300);
        await captchaChallengeFrame.evaluate(() => document.querySelector('#recaptcha-verify-button').click());
        
        return { solved: true, error: null };
    } catch (error) {
        return { solved: false, error: error };
    }
}