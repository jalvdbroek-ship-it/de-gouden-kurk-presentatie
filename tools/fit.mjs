// Welk onderdeel van elke slide zorgt voor overloop. Gebruik: node tools/fit.mjs
import { loadPlaywright } from './browser.mjs';

const url = process.env.URL || 'http://localhost:4174/';
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });

const rows = await page.evaluate(() =>
  [...document.querySelectorAll('.slide')].map((s) => {
    const r = s.getBoundingClientRect();
    return {
      title: s.dataset.title,
      height: Math.round(r.height),
      over: Math.round(r.height - window.innerHeight),
      kids: [...s.children].map((c) => ({
        cls: (c.className || c.tagName).slice(0, 40),
        h: Math.round(c.getBoundingClientRect().height),
      })),
    };
  })
);
rows.forEach((r) => {
  if (r.over > 4) console.log(r.title, r.height, r.over, JSON.stringify(r.kids));
});
await browser.close();
