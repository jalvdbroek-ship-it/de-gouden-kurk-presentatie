# Presentatie De Gouden Kurk

Een keuzemenu voor de ondernemer: een omslag met vier tegels (Website, Social media, App, Volgende stap) en per onderdeel één pagina met het doel, de functies, schermen, "waarom dit werkt voor De Gouden Kurk" en een grote knop naar het echte onderdeel. Live: https://jalvdbroek-ship-it.github.io/de-gouden-kurk-presentatie/

## Starten

```
python3 -m http.server 4175 --bind 127.0.0.1
```

Op Windows: `py -m http.server 4175 --bind 127.0.0.1`.

Open daarna `http://127.0.0.1:4175/`. Routes: `#/`, `#/website`, `#/social`, `#/app`, `#/vervolg`. Toetsen: Escape terug naar het overzicht, pijltjes naar het vorige of volgende onderdeel.

## Mappen

- `index.html`, `assets/pres.css`, `assets/pres.js`: de presentatie, zonder build. Strikte CSP: geen inline scripts of stijlen.
- `assets/tokens.css`: kleuren en lettertypen, gelijk aan de website.
- `assets/screens`: schermafbeeldingen (webp) van de website, de app en het socialpakket (maand 2).
- `assets/qr-app.svg`: QR-code naar de app, gemaakt met `tools/maak-qr.mjs` en een lokaal geïnstalleerde `qrcode` (MIT, versie 1.5.4). Geen dependency van dit project.
- `tools/maak-beelden.mjs`: legt de schermen opnieuw vast in `.shots/` (site op poort 4174, app op poort 4300). Zet ze daarna om naar webp in `assets/screens`; niet elke opname wordt gebruikt.
- `tools/check-a11y.mjs`, `fit.mjs`, `shot.mjs`: toegankelijkheid, overloop per route en schermafbeeldingen per route. Gebruik `URL=http://127.0.0.1:4175/ node tools/<naam>.mjs`.

## Let op

- De app-pagina noemt de demo-pincode van het beheer (1234). Die is geen beveiliging: wijzigingen blijven op het eigen apparaat.
- "Wat wij nog meer kunnen doen" noemt bewust geen prijzen.
- Contact loopt via e-mail (hetzelfde adres als bij La Caleta). Er staat geen telefoonnummer van WebRnds in, omdat dat nergens bevestigd is.
- Prijzen, voorraad, assortiment en openingstijden in de getoonde schermen zijn voorbeelden.
