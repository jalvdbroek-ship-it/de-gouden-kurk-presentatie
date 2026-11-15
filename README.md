# Presentatie De Gouden Kurk

Een korte presentatie (10 slides) die de website, het socialpakket en de app THE TASTE CLUB laat proeven. Opzet: een proefkaart met vier glazen, naar het voorbeeld van de presentatie voor La Caleta (`website-la-caleta/Presentatie-La-Caleta`).

## Starten

```
python3 -m http.server 4175
```

Open daarna `http://127.0.0.1:4175/`. Bladeren kan met scrollen, de pijlen rechtsonder of de pijltjestoetsen.

## Mappen

- `index.html`, `assets/pres.css`, `assets/pres.js`: de presentatie zelf, zonder build.
- `assets/tokens.css`: kleuren en lettertypen, gelijk aan de website (`../site`).
- `assets/screens`: schermafbeeldingen van de website, de app en het socialpakket (webp).
- `tools/maak-beelden.mjs`: legt de schermen van de website (poort 4174, `/v2/`) en de app (poort 4300) opnieuw vast in `.shots/`. Zet ze daarna om naar webp in `assets/screens`.
- `tools/check-a11y.mjs`, `fit.mjs`, `shot.mjs`: controles en schermafbeeldingen per slide. Gebruik `URL=http://127.0.0.1:4175/ node tools/<naam>.mjs`.

## Let op

- De website (GitHub Pages van `de-gouden-kurk-v2`) en de app (GitHub Pages van `the-taste-club`) hebben een live link op slide 3, 5 en 10.
- Prijzen, voorraad, assortiment en openingstijden in de getoonde schermen zijn voorbeelden. Slide 9 vraagt de ondernemer ze te bevestigen.
- De e-mailknop op de laatste slide gebruikt hetzelfde adres als de presentatie van La Caleta.
- Nog niet gepubliceerd: de presentatie draait alleen lokaal. `.github/workflows/deploy.yml` staat klaar voor GitHub Pages.
