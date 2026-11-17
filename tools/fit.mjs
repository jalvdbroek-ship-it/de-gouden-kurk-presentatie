// Controleert per route of iets buiten de pagina steekt (horizontale overloop), op desktop en mobiel.
// Gebruik: URL=http://127.0.0.1:4175/ node tools/fit.mjs
import { loadPlaywright } from './browser.mjs';

const url = process.env.URL || 'http://127.0.0.1:4175/';
const routes = ['/', '/website', '/social', '/app', '/vervolg'];
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
let problems = 0;
for (const [w, h] of [[1440, 900], [1024, 768], [390, 844], [320, 640]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const r of routes) {
    await page.goto(`${url}#${r}`, { waitUntil: 'networkidle' });
    await page.waitForFunction((route) => document.querySelector('.view:not([hidden])')?.dataset.route === route, r);
    await page.waitForTimeout(400);
    const res = await page.evaluate(() => {
      const cw = document.documentElement.clientWidth;
      const view = document.querySelector('.view:not([hidden])');
      const wide = [...view.querySelectorAll('*')].filter((e) => e.getBoundingClientRect().right > cw + 1).slice(0, 5).map((e) => `${e.tagName}.${e.className}`);
      return { over: document.documentElement.scrollWidth - cw, wide, height: Math.round(view.getBoundingClientRect().height) };
    });
    const bad = res.over > 1 || res.wide.length;
    if (bad) problems++;
    console.log(`${bad ? 'FAIL' : 'PASS'}  ${w}px #${r}  hoogte ${res.height}px${bad ? `  overloop ${res.over}px: ${res.wide.join(', ')}` : ''}`);
  }
  await page.close();
}
await browser.close();
process.exit(problems ? 1 : 0);
