const puppeteer = require('puppeteer');

const path = require('path');
const fs = require('fs');
const { rowClickTest } = require('./row_click_test.js');

const EXTENSION_PATH = path.join(__dirname, '../dist');

async function getExtensionId(browser) {
    const targets = await browser.targets();
    const backgroundPageTarget = targets.find(
        target => target.type() === 'background_page' || target.type() === 'service_worker'
    );
    const url = backgroundPageTarget.url();
    const [, , extensionId] = url.split('/');
    return extensionId;
}

async function initializeData(browser) {
    const targets = await browser.targets();
    const backgroundPageTarget = targets.find(
        target => target.type() === 'background_page' || target.type() === 'service_worker'
    );
    await (await backgroundPageTarget.worker()).evaluate(() => {
        chrome.storage.local.set({
            'word_apple': { word: 'apple', count: 5, state: 0, kuromojiId: 1 },
            'word_banana': { word: 'banana', count: 10, state: 1, kuromojiId: 2 },
            'word_cherry': { word: 'banana', count: 15, state: 2, kuromojiId: 3 },
        });
    });
}

describe('Kotoba Check Extension E2E', () => {
    let browser, page, extensionId;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            args: [
                `--disable-extensions-except=${EXTENSION_PATH}`,
                `--load-extension=${EXTENSION_PATH}`,
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ],
            defaultViewport: null,
        });

        await new Promise((r) => setTimeout(r, 1000));

        await initializeData(browser);

        page = await browser.newPage();

        extensionId = await getExtensionId(browser);
        await page.goto(`chrome-extension://${extensionId}/visualizer/visualizer.html`);
    }, 2000000);

    afterAll(async () => {
        await browser.close();
    });

    it('performs all word movement and export actions correctly', async () => {
        await rowClickTest(page);
    }, 10000000);
});