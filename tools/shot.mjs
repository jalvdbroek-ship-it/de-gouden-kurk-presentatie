// Screenshots van de presentatie per slide. Gebruik: node tools/shot.mjs [map]
import { loadPlaywright } from './browser.mjs';
import { mkdirSync } from 'node:fs';

const url = process.env.URL || 'http://localhost:4174/';
const map = process.argv[2] || '.shots';

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
mkdirSync(map, { recursive: true });

const sizes = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobiel', width: 390, height: 844 },
];

for (const size of sizes) {
  const page = await browser.newPage({ viewport: { width: size.width, height: size.height } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const n = await page.evaluate(() => document.querySelectorAll('.slide').length);
  for (let i = 0; i < n; i += 1) {
    await page.evaluate((index) => {
      document.querySelectorAll('.slide')[index].scrollIntoView({ block: 'start' });
    }, i);
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${map}/${size.name}-${String(i + 1).padStart(2, '0')}.png` });
  }
  await page.close();
}

await browser.close();
console.log('opgeslagen in', map);
