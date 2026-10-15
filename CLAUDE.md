# Sprachbuddy – Hinweise für Claude

- Commits OHNE `Co-Authored-By`-Zeile: Vercel Hobby blockt damit ausgelöste
  Deploys. Autor-Mail muss auf GitHub verifiziert sein.
- Inhalte (Sätze, Zuständigkeiten) nur als Datei unter `src/data/` – nie fest
  in Komponenten. Neue Sätze immer mit `"status": "ungeprüft"`; `geprüft` und
  `korrigiert` vergibt nur ein Mensch aus dem Ort über die Prüfansicht.
- Hausschreibung eines Ortes steht im Paket (`hausschreibung`) und gilt für
  alle Sätze dieses Ortes.
- Design: Volt-Farben und Ubuntu aus `src/index.css`, kein Logo, kein
  Parteiname in der Oberfläche (nur unter „Über").
- Vor dem Commit: `npm run build` und `node werkstatt/klicktest.cjs` gegen
  `npm run preview`.
