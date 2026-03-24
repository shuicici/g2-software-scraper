import { Dataset, Actor, log } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

interface Input {
    query: string;
}

async function main() {
    await Actor.init();
    const input = await Actor.getInput<Input>() as Input;
    if (!input?.query) throw new Error('Query required');
    
    const url = `https://www.g2.com/search?query=${encodeURIComponent(input.query)}`;
    
    const crawler = new PlaywrightCrawler({
        maxConcurrency: 1,
        requestHandlerTimeoutSecs: 90,
        requestHandler: async ({ page }) => {
            await page.waitForTimeout(3000);
            
            const results = await page.evaluate(() => {
                const items: any[] = [];
                document.querySelectorAll('.product-row').forEach((el: any) => {
                    items.push({
                        name: el.querySelector('.product-name')?.textContent?.trim(),
                        rating: el.querySelector('.rating')?.textContent?.trim(),
                        reviews: el.querySelector('.review-count')?.textContent?.trim(),
                        description: el.querySelector('.product-description')?.textContent?.trim()
                    });
                });
                return items;
            });
            
            await Dataset.pushData({ query: input.query, count: results.length, results });
            log.info(`Found ${results.length} products`);
        }
    });
    
    await crawler.run([{ url }]);
    await Actor.exit();
}
main().catch(e => { console.error(e); process.exit(1); });
