"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apify_1 = require("apify");
const crawlee_1 = require("crawlee");
async function main() {
    await apify_1.Actor.init();
    const input = await apify_1.Actor.getInput();
    if (!input?.query)
        throw new Error('Query required');
    const url = `https://www.g2.com/search?query=${encodeURIComponent(input.query)}`;
    const crawler = new crawlee_1.PlaywrightCrawler({
        maxConcurrency: 1,
        requestHandlerTimeoutSecs: 90,
        requestHandler: async ({ page }) => {
            await page.waitForTimeout(3000);
            const results = await page.evaluate(() => {
                const items = [];
                document.querySelectorAll('.product-row').forEach((el) => {
                    items.push({
                        name: el.querySelector('.product-name')?.textContent?.trim(),
                        rating: el.querySelector('.rating')?.textContent?.trim(),
                        reviews: el.querySelector('.review-count')?.textContent?.trim(),
                        description: el.querySelector('.product-description')?.textContent?.trim()
                    });
                });
                return items;
            });
            await apify_1.Dataset.pushData({ query: input.query, count: results.length, results });
            apify_1.log.info(`Found ${results.length} products`);
        }
    });
    await crawler.run([{ url }]);
    await apify_1.Actor.exit();
}
main().catch(e => { console.error(e); process.exit(1); });
