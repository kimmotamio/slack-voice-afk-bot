const puppeteer = require('puppeteer');
require('dotenv').config();

(async () => {
    console.log('Launching browser. Hold tight.');
    const browser = await puppeteer.launch({ headless: Boolean(process.env.HEADLESS === 'true'), slowMo: 10, args: [ '--no-sandbox',
    '--disable-setuid-sandbox',
    '--allow-hidden-media-playback',
    '--use-fake-ui-for-media-stream=1',
    '--use-fake-device-for-media-stream=1']
     });
    console.log('Launching new tab. Exciting.');
    const page = await browser.newPage();
    console.log('Setting nice viewPort :)');
    await page.setViewport({
        width: 1200,
        height: 900,
        deviceScaleFactor: 1,
    });

    // 01 - Navigate to slack login page
    console.log('01 - Navigate to slack login page');
    await page.goto(`https://app.slack.com/client/T01QJLJ4L4W/${process.env.SLACK_CLIENT_ID}`, {
        waitUntil: 'networkidle2',
    });

    // 02 - Fill out domain & proceed
    console.log('02 - Fill out domain & proceed');
    await page.type('#domain', process.env.SLACK_DOMAIN);
    await page.click('button[type="submit"]');

    // Chill for a little bit
    await chill(2500);

    // 03 - Login details
    console.log('03 - Login details');
    await page.type('#email', process.env.SLACK_EMAIL);
    await page.type('#password', process.env.SLACK_PASSWORD);
    // Accept the damn cookies
    await page.click('#onetrust-accept-btn-handler');
    await page.click('button[type="submit"]');

    // Chill for a little bit
    await chill(5000);

    // 04 - Finally we will navigate to our workspace
    console.log('04 - Finally we will navigate to our workspace');
    await page.goto(`https://${process.env.SLACK_DOMAIN}.slack.com/`, {
        waitUntil: 'networkidle2',
    });

    // Chill for a little bit
    await chill(3500);

    // 05 - Navigate to correct channel
    console.log('05 - Navigate to correct channel');
    // Click "Not now" button for downloading slack app
    await page.click('.c-button-unstyled.p-download_modal__not_now');

    // Chill for a little bit
    await chill(5000);


    // Select correct slack channel
    console.log('Select correct slack channel.');
    const channelElement = await page.$(`[data-qa-channel-sidebar-channel-id="${process.env.SLACK_CHANNEL_ID}"]`);
    channelElement.click();

    await chill(5000);

    // Click info button
    // await page.click('.c-button-unstyled.p-ia__view_header__button');
    const infoButton = await page.$(`[data-qa="channel-details"]`);
    infoButton.click();
    await chill(1500);

    // 06 - Start the call!
    console.log('06 - Start the call!')
    const callButton = await page.$('[data-qa="call"]');
    callButton.click();

    await chill(2500);

    await page.click('.c-button.c-button--primary.c-button--medium');

    // await browser.close();
})();

async function chill(ms = 1000) {
    console.log(`Chilling for ${ms}ms`);
    return new Promise(resolve => {
        setTimeout(() => {
            return resolve();
        }, ms);
    });
}