# Sprachbuddy

Deutsch lernen und den eigenen Ort verstehen – mit dem Dialekt, den der Bäcker
spricht, und den Stellen, die wirklich zuständig sind. Offen, kostenlos, ohne
Konto, ohne Server: eine PWA, die nach dem ersten Aufruf auch offline läuft.

Die Inhalte entstehen Ort für Ort und werden von Menschen von dort geprüft.
Jeder Satz trägt seinen Status (ungeprüft, geprüft, korrigiert) sichtbar in
der App.

## Aufbau

- `src/data/karte/ludwigsburg.json` – die 39 Gemeinden des Landkreises als
  Ortswähler (Geometrie und Rathausdaten aus der Kreiskarte Ludwigsburg)
- `src/data/pakete/<AGS>.json` – ein Sprachpaket je Ort, Schlüssel ist der
  amtliche Gemeindeschlüssel (Vaihingen an der Enz: `08118073`)
- `src/data/orte/<AGS>.json` – Zuständigkeiten des Ortes, gepflegt von der
  Ortsgruppe
- `src/data/index.ts` – Register: welche Pakete und Orte es gibt
- `src/lib/` – Vorlesen (Stimme des Geräts), Wiederholung in Abständen
  (Leitner-Boxen im Browser), Übungsgenerator, Prüfung mit Export
- `src/components/` – Ortswahl, Start, Lektion, Zuständig, Prüfansicht, Über
- `werkstatt/` – Klick-Test mit Playwright (wird nicht ausgeliefert)

Stack: React 19, Vite, TypeScript, Tailwind 4, vite-plugin-pwa. Farben und
Schrift nach dem Volt-Corporate-Design, ohne Logo.

## Ein Paket prüfen

1. In der App den Ort wählen, „Prüfen" öffnen.
2. Satz für Satz: „In Ordnung" oder „Korrigieren" (Schwäbisch, Hochdeutsch,
   Anmerkung). Die Urteile bleiben im Browser des Geräts.
3. „Prüfung exportieren" lädt `JJJJ-MM-TT_Pruefung_<AGS>.json` herunter:
   das Paket mit den Korrekturen plus ein Protokoll.
4. Datei einschicken oder als Pull Request einbauen: das `paket` aus dem
   Export ersetzt `src/data/pakete/<AGS>.json`.

## Ein neues Paket anlegen

`src/data/pakete/08118073.json` kopieren, `ags`, `ort`, `variante` anpassen,
Sätze eintragen (alle mit `"status": "ungeprüft"`), in `src/data/index.ts`
eintragen. Die Hausschreibung steht im Paket selbst – damit Schreibweisen
innerhalb eines Ortes einheitlich bleiben. Orte außerhalb des Landkreises
brauchen zusätzlich eine Karte; der Ortswähler ist dafür vorbereitet
(gleicher Schlüssel, andere Geometrie).

## Entwickeln

```
npm install
npm run dev        # lokal
npm run build      # dist/
cd werkstatt && npm install && node klicktest.cjs   # nach `npm run preview`
```

Jeder Push auf `main` deployt über Vercel.

## Quellen und Lizenzen

- Verwaltungsgrenzen: LGL-BW (2026), Datenlizenz Deutschland – Namensnennung
  2.0; Gemeindedaten Landratsamt Ludwigsburg; Einwohner Statistisches
  Landesamt BW (Stand 31.03.2026) – übernommen aus der Kreiskarte Ludwigsburg.
- Schwäbisch-Pakete: Entwürfe nach Hausschreibung, Nachschlagewerke Hermann
  Fischer, Schwäbisches Wörterbuch (1904–1936) und Sprachatlas von Nord
  Baden-Württemberg (Universität Tübingen, 2019).
- Schrift Ubuntu (Ubuntu Font Licence).
