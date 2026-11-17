// Maakt de QR-code naar de app als SVG (assets/qr-app.svg). Gebruikt een lokaal geïnstalleerde "qrcode" (MIT); zet QRCODE=<pad naar het pakket>.
// Gebruik: QRCODE=<pad>/node_modules/qrcode node tools/maak-qr.mjs
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const QRCode = require(process.env.QRCODE ?? "qrcode");
const url = process.env.APP_URL ?? "https://jalvdbroek-ship-it.github.io/the-taste-club/";
const svg = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 2, color: { dark: "#120d0cff", light: "#f5efe4ff" } });
writeFileSync(new URL("../assets/qr-app.svg", import.meta.url), svg.replace("<svg ", `<svg role="img" aria-label="QR-code naar ${url}" `));
console.log("QR-code gemaakt voor", url);
