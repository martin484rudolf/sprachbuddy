---
name: stichprobe-streaming
description: Rundenweise Prüfung von Sprachfassungen bei Streaming-Anbietern für die Übersicht „Filme und Serien“ (src/data/medien.json). Martin schaut am Handy und spricht, Claude fragt eine Sache je Nachricht und trägt die Antworten ein. Verwenden, wenn Martin „Stichprobe“, „Netflix prüfen“, „Mitschauen“ oder „du bist mein Gast“ sagt.
---

# Stichprobe Streaming

Martin sitzt mit dem Handy vor Netflix (oder einem anderen Anbieter) und spricht
per Diktat. Claude ist Gast: fragt, hört zu, schreibt mit. Claude meldet sich
nirgends an und sieht kein Konto.

## Grundsätze

- **Eine Frage je Nachricht.** Antworten von Claude höchstens drei Sätze, zum
  Vorlesen geeignet: keine Tabellen, keine Code-Blöcke, keine Aufzählungen.
  Adressen ausgeschrieben im Satz („netflix Punkt com Schrägstrich browse
  Schrägstrich subtitles“ ist nicht nötig; „netflix.com/browse/subtitles“ reicht).
- **Nur Titelnamen und Ja oder Nein.** Keine Profilnamen, keine Kontodaten,
  keine Bildschirmfotos, kein Sehverlauf. Nennt Martin versehentlich mehr,
  nicht notieren und nicht wiederholen (KI-Regel 1).
- **Nichts raten.** Was Martin nicht gesehen hat, bleibt „unbekannt“.
- **Jederzeit Ende.** Sagt Martin „Ende“ oder „Test beendet“, wird gesichert,
  was bis dahin da ist. Angefangene Sprachen bleiben „ungeprüft“.

## Datei

`src/data/medien.json`, Anbieter `netflix`, Block `herkunftssprachen.sprachen`.
Je Sprache: `umfang` (`wenige` unter 20 Titel, `einige` bis 100, `viele`
darüber, `keine`), `beispiele` (bis drei Einträge `titel`, `deutscherTon`),
`stand` (Datum der Prüfung), `status` auf `geprüft`.
Andere Anbieter: Feld `lernen` oder `suche` anpassen, `status` auf `geprüft`,
`quelle` ergänzen um „Stichprobe am eigenen Konto, JJJJ-MM-TT“.

## Ablauf Stichprobe (je Sprache eine Runde)

1. **Einstieg.** Anbieter und erste Sprache klären, falls nicht gesagt.
   Reihenfolge laut Datei: Arabisch, Ukrainisch, Türkisch, Persisch, Russisch,
   Englisch. Martin darf überspringen.
2. **Seite.** Netflix: im Handy-Browser `netflix.com/browse/subtitles`,
   erstes Feld „Untertitel“, zweites Feld die Sprache. Erscheint die Seite
   nicht, `netflix.com/browse/audio` versuchen; sonst Sprache als „unbekannt“
   lassen und notieren, was Martin sieht.
3. **Umfang.** Frage: unter zwanzig, bis hundert, oder über hundert Titel?
4. **Drei Titel.** Je Titel eine Frage: Titel antippen, bei „Details“ oder
   „Infos“ die Zeile „Audio“ ansehen. Steht dort „Deutsch“? Antwort: Titelname
   und Ja oder Nein. Erst nach der Antwort kommt der nächste Titel.
5. **Eintragen.** Sofort in `medien.json` schreiben, kurz bestätigen:
   „Arabisch notiert, drei Beispiele, zwei mit deutschem Ton.“
6. **Weiter?** Fragen: nächste Sprache oder Ende.

## Ablauf Mitschauen (Gast)

Martin hat einen Titel offen und will ihn anschauen. Claude fragt nacheinander:
welcher Titel, welche Tonspuren stehen unter Audio, welche Untertitel. Daraus
wird ein Beispiel für jede Sprache, die in der Datei steht. Danach ist Claude
still, bis Martin wieder etwas sagt. Keine Fragen zum Inhalt der Sendung.

## Ende

1. `npm run build`, dann `node werkstatt/klicktest.cjs` gegen `npm run preview`.
2. Commit mit genau einem Autor `Martin Rudolf <martinrudolf484@gmail.com>`,
   ohne `Co-Authored-By`, Nachricht: „Stichprobe Netflix: <Sprachen> geprüft“.
3. Push auf den Arbeitsbranch, nicht auf `main`. Martin merged.
4. Kurzer Bericht in drei Sätzen: welche Sprachen geprüft, was auffiel, was offen.

## Stimme

Diese Sitzung hat keine eigene Sprachausgabe. Martin nutzt Diktat und
Vorlesen des Handys; darum die kurzen Antworten. Versteht Claude ein
diktiertes Wort nicht sicher (Titelname), nachfragen statt deuten.
