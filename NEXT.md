---
schirm: volt
titel: "Sprachbuddy (Deutsch lernen, den Ort verstehen)"
status: "🟢"
status_grund: Gerüst steht (PWA, Ortswähler Kreis Ludwigsburg, Pilotpaket Vaihingen mit 50 Sätzen, Prüfansicht) · seit 2026-10-31 Ansicht „Filme und Serien“ (medien.json) und Skill stichprobe-streaming · alles noch ungeprüft · Branch claude/sprachbuddy-app-status-u18glk, noch nicht auf main
naechste_aktion: Stichprobe Netflix am Handy (Arabisch, Ukrainisch, Türkisch, Persisch, Russisch, Englisch) rundenweise mit Claude · Branch nach main mergen · jemanden aus Vaihingen für die Schwäbisch-Prüfung finden
blocker: []
wartet_auf: martin
warte_was: Stichprobe Netflix (Runde 1 Arabisch gestellt) und Merge des Branches
warte_seit: 2026-10-31
nachhaken_nach: null
deadline: null
letzte_aenderung: 2026-10-31
meta: "GitHub martin484rudolf/sprachbuddy · Vercel, Push auf main deployt · noindex · React 19, Vite, Tailwind 4 · Inhalte nur unter src/data"
tags: [volt, sprache, pwa, vaihingen, integration]
---

# NEXT

Stand: 2026-10-31. Wird am Ende jeder Sitzung fortgeschrieben.

## Läuft

- **Filme und Serien** (2026-10-31): `src/data/medien.json` mit Netflix, Prime Video,
  Disney+, ARTE, ARD, ZDF, DW Deutsch lernen und Language Reactor. Preise aus
  Presseberichten mit Stand-Monat, alles „ungeprüft“. Ansicht im Menü, Quellen
  unter „Über“, Schritt im Klick-Test.
- **Stichprobe Netflix**: Skill `.claude/skills/stichprobe-streaming/`. Martin am
  Handy, Claude fragt eine Sache je Nachricht und schreibt in `medien.json`.
  Runde 1 (Arabisch) ist gestellt, Antwort steht aus.
- Branch `claude/sprachbuddy-app-status-u18glk` liegt zwei Commits vor `main`.

## Als Nächstes

1. Stichprobe Netflix: sechs Sprachen, Ergebnis mit Datum und Status „geprüft“.
2. Merge auf `main` durch Martin; Vercel deployt dann.
3. Schwäbisch-Paket Vaihingen: 50 Sätze warten auf ein Ohr aus dem Ort
   (Prüfansicht, Export, Datei einschicken).
4. Zuständigkeiten Vaihingen: nur ein Eintrag (Bürgerbüro), ebenfalls ungeprüft.
5. Arabische Übersetzungen nur in der Lage „Bäcker“; die anderen vier Lagen
   haben nur Englisch.

## Offen

- Kartendatei `src/data/karte/ludwigsburg.json` enthält je Gemeinde den Namen
  der Bürgermeisterin oder des Bürgermeisters (aus der Kreiskarte). Öffentliche
  Amtsträger, aber personenbezogen. Vor einer Veröffentlichung entscheiden.
- GitLab-Spiegel: Action vorhanden, ob Variable und Token im Repo gesetzt sind,
  ist von der Cloud aus nicht sichtbar.

## Erledigt

- 2026-10-31: Ansicht „Filme und Serien“, `medien.json`, Skill
  `stichprobe-streaming`, README-Abschnitt zur Pflege.
- 2026-10-15: Gerüst, Ortswähler, Pilotpaket Vaihingen, Prüfansicht mit Export,
  noindex, GitLab-Spiegel-Action.
