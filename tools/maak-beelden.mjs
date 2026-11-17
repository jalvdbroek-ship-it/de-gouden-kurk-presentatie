// Legt de schermen vast die in de presentatie staan. Start eerst de site (npm start in site/, poort 4174; de hoofdsite en /social/) en de app (npm start in the-taste-club/, poort 4300).
// Gebruik: node tools/maak-beelden.mjs   Uitvoer: .shots/*.png (daarna omzetten naar webp, zie README).
import { mkdirSync } from "node:fs";
import { loadPlaywright } from "./browser.mjs";

const SITE = process.env.SITE || "http://127.0.0.1:4174/";
const APP = process.env.APP || "http://localhost:4300/";
mkdirSync(".shots", { recursive: true });
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const out = (n) => `.shots/${n}.png`;

{ // De website: hero, collectie, advies
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(SITE, { waitUntil: "networkidle" });
  await page.click("[data-gate-yes]");
  await page.waitForTimeout(6500);
  await page.screenshot({ path: out("website-home") });
  for (const [selector, offset, name] of [["[data-grid]", 150, "website-collectie"], ["#advies", 0, "website-advies"]]) {
    await page.evaluate(([s, o]) => window.scrollTo(0, document.querySelector(s).getBoundingClientRect().top + scrollY - o), [selector, offset]);
    await page.waitForTimeout(3200);
    await page.screenshot({ path: out(name) });
  }
  await page.evaluate(() => window.scrollTo(0, document.querySelector("#app").getBoundingClientRect().top + scrollY - 76));
  await page.waitForTimeout(3200);
  await page.screenshot({ path: out("website-app") });
}

{ // De website op een telefoon en het socialportfolio
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(SITE, { waitUntil: "networkidle" });
  await page.click("[data-gate-yes]");
  await page.waitForTimeout(4500);
  await page.screenshot({ path: out("website-mobiel") });
  const desk = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await desk.goto(new URL("social/", SITE).href, { waitUntil: "networkidle" });
  await desk.evaluate(() => window.scrollTo(0, document.querySelector("#maand-2").getBoundingClientRect().top + scrollY - 40));
  await desk.waitForTimeout(1500);
  await desk.screenshot({ path: out("social-portfolio") });
}

const phone = async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: "block" });
  await ctx.addInitScript(() => { sessionStorage.setItem("tc.leeftijd18", "ja"); sessionStorage.setItem("tc.intro", "1"); });
  return ctx.newPage();
};
const go = async (page, route) => { await page.goto(`${APP}#/${route}`); await page.waitForSelector("#view h1"); await page.waitForTimeout(2200); };

{ // De app op een telefoon
  const page = await phone();
  await go(page, ""); await page.screenshot({ path: out("app-home") });
  await go(page, "smaak");
  for (let i = 0; i < 4; i++) { await page.locator('.choice[data-val="high"]').click(); await page.waitForSelector(`.steps__i:nth-child(${i + 2})[aria-current]`); }
  await page.click('[data-cat="gin"]'); await page.click("[data-next]");
  await page.click('[data-moment="aperitief"]'); await page.click("[data-next]");
  await page.waitForSelector(".radar"); await page.waitForTimeout(2600);
  await page.locator(".rank [data-fav] >> nth=0").click();
  await page.waitForTimeout(3500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: out("app-smaak") });
  await go(page, "cadeau");
  await page.click('[data-g="voor"][data-v="partner"]'); await page.click('[data-g="gelegenheid"][data-v="jubileum"]');
  await page.waitForTimeout(800); await page.screenshot({ path: out("app-cadeau") });
  await go(page, "pick"); await page.screenshot({ path: out("app-pick") });
  await go(page, "collectie");
  if (await page.locator("[data-sample]").count()) { await page.click("[data-sample]"); await page.waitForTimeout(1500); }
  await page.screenshot({ path: out("app-collectie") });
  await go(page, "rondleiding"); await page.screenshot({ path: out("app-rondleiding") });
}

{ // Het beheerprototype op een laptop
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, serviceWorkers: "block" });
  await ctx.addInitScript(() => { sessionStorage.setItem("tc.leeftijd18", "ja"); sessionStorage.setItem("tc.intro", "1"); });
  const page = await ctx.newPage();
  await page.goto(`${APP}#/beheer`); await page.waitForSelector("#pin-i");
  await page.fill("#pin-i", "1234"); await page.click("#pin button[type=submit]");
  await page.waitForSelector("#abody .card"); await page.waitForTimeout(1500);
  await page.screenshot({ path: out("app-beheer") });
}
await browser.close();
console.log("klaar: .shots/");
