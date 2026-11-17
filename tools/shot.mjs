// Screenshots van elke route, op desktop en mobiel. Gebruik: URL=http://127.0.0.1:4175/ node tools/shot.mjs [map]
import { loadPlaywright } from './browser.mjs';
import { mkdirSync } from 'node:fs';

const url = process.env.URL || 'http://127.0.0.1:4175/';
const map = process.argv[2] || '.shots';
const routes = ['/', '/website', '/social', '/app', '/vervolg'];
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
mkdirSync(map, { recursive: true });

for (const size of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobiel', width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: { width: size.width, height: size.height } });
  for (const r of routes) {
    await page.goto(`${url}#${r}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${map}/${size.name}-${r.slice(1) || 'overzicht'}.png`, fullPage: true });
  }
  await page.close();
}
await browser.close();
console.log('opgeslagen in', map);
